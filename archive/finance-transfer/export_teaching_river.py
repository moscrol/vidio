#!/usr/bin/env python3
"""把教学长河从本地旁路库导出成可移交的 parquet（**只读**）。

回答的问题：「是不是只有我本地的 duckdb 数据才算放水?」

- **放水**（跑 ``scripts/teaching_framework.py build-*``）确实只能在本地：
  它要只读 ATTACH 3.9 GB 的主库 ``market_feature_store.duckdb``。
- **但放完之后，长河不必留在本地。** 河（``river_objects.teaching_objects``）只认
  旁路库这一个文件，连 legacy 表都不碰——实测：只含 10 张 teaching 表的库，
  产出的河对象与完整库逐个相同。

所以这个脚本做的事：把 teaching 那一层单独取出来，带 ``first_known_at``，
导成 parquet + 一份清单。云端 agent 用配套的 ``--rehydrate`` 还原成一个瘦身旁路库，
直接喂给 ``teaching_objects``。

**体量**（按 432 个交易日 × 848 个板块 × 17 个角色标签 + 市场级的同形状数据实测）：
6.2M 行，duckdb 289 MB，**parquet/zstd 21 MB**（悲观口径，一半字段取真浮点）。

## 纪律

- 只开 ``read_only=True`` 连接，不建表、不写旁路库、不联网。
- **默认只导市场级**（``--scope market``）。板块级 / 个股级要显式给 ``--scope``——
  披露范围是你的决定，不是脚本的默认值。
- ``--knowledge-cutoff`` 在导出时就按 ``first_known_at <= C`` 过滤，
  导出的东西本身就是 PIT 干净的，云端拿到也造不出前视。
- 清单里记录每张表的行数、日期范围、戳记分布与 SHA256，便于核验内容没被改过。

## 用法

    # 导出（本地）
    python3 export_teaching_river.py --labels-db db/history_labels.duckdb --out river-export/

    # 只要能证明在 2026-03-31 当天已知的那部分
    python3 export_teaching_river.py --labels-db db/history_labels.duckdb \
        --out river-export/ --knowledge-cutoff 2026-03-31

    # 还原（云端，不需要主库）
    python3 export_teaching_river.py --rehydrate river-export/ --to slim_sidecar.duckdb
"""

from __future__ import annotations

import argparse
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

import duckdb

TEACHING_TABLES = (
    "history_teaching_labels", "history_teaching_gaps", "history_leader_succession",
    "history_overtaken", "history_reference_stages", "history_range_leaders",
    "history_range_leader_handoffs", "history_dynasties", "history_dynasty_handoffs",
    "history_teaching_receipts",
)

#: 哪些表有 entity_type 列（能按 scope 过滤）；其余表整张导。
ENTITY_SCOPED = ("history_teaching_labels",)

SCOPES = {
    "market": ("market",),
    "market+sector": ("market", "sector"),
    "all": None,  # 不过滤
}


def _sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def _columns(con: duckdb.DuckDBPyConnection, table: str) -> list[str]:
    return [str(r[1]) for r in con.execute(f"PRAGMA table_info('{table}')").fetchall()]


def export(labels_db: Path, out: Path, *, scope: str, cutoff: str | None) -> int:
    if not labels_db.is_file():
        print(f"旁路库不存在: {labels_db}")
        return 2
    out.mkdir(parents=True, exist_ok=True)
    entity_types = SCOPES[scope]

    con = duckdb.connect(str(labels_db), read_only=True)
    manifest: dict[str, object] = {
        "exported_at": datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
        "source": str(labels_db),
        "scope": scope,
        "knowledge_cutoff": cutoff,
        "read_only": True,
        "writes": "只写 --out 目录下的 parquet 与本清单；未写旁路库、未联网。",
        "pit_note": (
            "若给了 knowledge_cutoff，history_teaching_labels 已按 first_known_at <= C 过滤，"
            "且 first_known_at 为 NULL 的行一并剔除（fail-closed，与河的 PIT 闸同方向）。"
            "其余表暂无 first_known_at 列，**未按 PIT 过滤**，见下方 unfiltered_tables。"
        ),
        "tables": {},
        "unfiltered_tables": [],
    }
    present = {r[0] for r in con.execute("SHOW TABLES").fetchall()}
    try:
        for table in TEACHING_TABLES:
            if table not in present:
                manifest["tables"][table] = {"status": "absent"}
                continue
            cols = _columns(con, table)
            where = ["TRUE"]
            params: list[object] = []
            if entity_types and table in ENTITY_SCOPED and "entity_type" in cols:
                where.append(f"entity_type IN ({', '.join('?' for _ in entity_types)})")
                params.extend(entity_types)
            if cutoff:
                if "first_known_at" in cols:
                    where.append("first_known_at IS NOT NULL AND first_known_at <= ?")
                    params.append(f"{cutoff} 23:59:59")
                else:
                    manifest["unfiltered_tables"].append(table)

            target = out / f"{table}.parquet"
            sql = f"SELECT * FROM {table} WHERE {' AND '.join(where)}"
            con.execute(
                f"COPY ({sql}) TO '{target}' (FORMAT parquet, COMPRESSION zstd)", params
            )
            n = con.execute(f"SELECT count(*) FROM ({sql})", params).fetchone()[0]
            info: dict[str, object] = {
                "status": "ok", "rows": int(n), "columns": cols,
                "bytes": target.stat().st_size, "sha256": _sha256(target),
            }
            if "trade_date" in cols and n:
                lo, hi = con.execute(
                    f"SELECT min(trade_date), max(trade_date) FROM ({sql})", params
                ).fetchone()
                info["trade_date_range"] = [str(lo), str(hi)]
            if "first_known_at" in cols and n:
                # 戳记分布：全部挤在同一个时刻 = 这批行还没有真正的 PIT 身份。
                info["first_known_at_distinct"] = int(con.execute(
                    f"SELECT count(DISTINCT first_known_at) FROM ({sql})", params
                ).fetchone()[0])
                info["first_known_at_null"] = int(con.execute(
                    f"SELECT count(*) FROM ({sql}) WHERE first_known_at IS NULL", params
                ).fetchone()[0])
            manifest["tables"][table] = info
    finally:
        con.close()

    (out / "MANIFEST.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    total = sum(t.get("rows", 0) for t in manifest["tables"].values() if isinstance(t, dict))
    size = sum(t.get("bytes", 0) for t in manifest["tables"].values() if isinstance(t, dict))
    print(json.dumps(manifest, ensure_ascii=False, indent=2))
    print(f"\n--- 导出 {total:,} 行，{size/1024/1024:.1f} MB → {out} ---")
    if total == 0:
        print("⚠ 一行都没有。多半是 build-* 还没对这个库跑过 —— 先用")
        print("  diagnose_empty_teaching_tables.py 查 history_build_meta。")
    if manifest["unfiltered_tables"]:
        print(f"⚠ 这些表没有 first_known_at 列，**未按 PIT 过滤**：{manifest['unfiltered_tables']}")
        print("  王朝本就是事后对象；区间高标机制上应当前缀稳定但没有证据。按事后样本看待。")
    return 0


def rehydrate(src: Path, to: Path) -> int:
    """从导出目录还原一个瘦身旁路库。不需要主库，也不需要 legacy 表。"""

    files = sorted(src.glob("*.parquet"))
    if not files:
        print(f"{src} 下没有 parquet")
        return 2
    to.parent.mkdir(parents=True, exist_ok=True)
    to.unlink(missing_ok=True)
    con = duckdb.connect(str(to))
    try:
        for f in files:
            con.execute(f"CREATE TABLE {f.stem} AS SELECT * FROM read_parquet('{f}')")
            n = con.execute(f"SELECT count(*) FROM {f.stem}").fetchone()[0]
            print(f"  {f.stem:34} {n:>10,} 行")
    finally:
        con.close()
    print(f"\n--- 还原到 {to}（{to.stat().st_size/1024/1024:.1f} MB）---")
    print("直接喂给 river_objects.teaching_objects(labels_db=<这个文件>, as_of=...) 即可。")
    print("已实测：只含 teaching 表的库，产出的河对象与完整库逐个相同。")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    ap.add_argument("--labels-db", type=Path, help="本地旁路库")
    ap.add_argument("--out", type=Path, help="导出目录")
    ap.add_argument("--scope", choices=sorted(SCOPES), default="market",
                    help="导哪些实体层。默认只导市场级 —— 披露范围由你决定，不由默认值决定。")
    ap.add_argument("--knowledge-cutoff", default=None,
                    help="只导 first_known_at <= 这一天的行（YYYY-MM-DD）。导出物本身就是 PIT 干净的。")
    ap.add_argument("--rehydrate", type=Path, help="从导出目录还原")
    ap.add_argument("--to", type=Path, help="还原到哪个 duckdb 文件")
    args = ap.parse_args()

    if args.rehydrate:
        if not args.to:
            ap.error("--rehydrate 需要同时给 --to")
        return rehydrate(args.rehydrate, args.to)
    if not (args.labels_db and args.out):
        ap.error("导出需要 --labels-db 与 --out")
    return export(args.labels_db, args.out, scope=args.scope, cutoff=args.knowledge_cutoff)


if __name__ == "__main__":
    raise SystemExit(main())
