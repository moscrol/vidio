#!/usr/bin/env python3
"""诊断：旁路库里 10 张教学表为什么是 0 行。

**只读。**只开 read_only=True 连接，不建表、不写库、不联网、不动生产画像。
不 import 仓里任何模块（避免版本差异），只用 duckdb。

用法：
    python3 diagnose_empty_teaching_tables.py --labels-db db/history_labels.duckdb

补证包 data/sidecar_audit.json 实测 history_teaching_labels 等 7 张表 0 行。
本脚本查的是**审计没查的那几样**，用来区分三种可能：

  A. 教学构建从来没跑过        → history_build_meta 里没有教学 build_kind
  B. 跑过但被后来的操作清空     → 有 meta 行、row_count>0，但表 0 行
  C. 跑过但 fail-closed 中止    → 教学表列集合与当前 DDL 不一致（schema 过期）

A 的机理（已在代码里坐实，不是推测）：
  store.open_labels_db(read_only=False) → ensure_schema() → TEACHING_DDL 里全是
  CREATE TABLE IF NOT EXISTS。所以**任何**一次对旁路库的写入（包括 legacy 的
  methodology_backtest build-labels，它写 history_calendar）都会顺手把 10 张空的
  教学表建出来。⇒ 教学表「存在」不等于教学构建跑过。

C 在这份代码上基本可以排除：store.py 最后一次改是 2026-09-08，TEACHING_DDL 最后
一次改是 2026-09-07，而库是 09-30 写的，晚了三周。但你本机代码版本可能不同，
所以仍然查一下。
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import duckdb

LEGACY_TABLES = ("history_calendar", "history_labels", "history_data_gaps", "history_outcomes")
TEACHING_TABLES = (
    "history_teaching_labels", "history_teaching_gaps", "history_leader_succession",
    "history_overtaken", "history_reference_stages", "history_range_leaders",
    "history_range_leader_handoffs", "history_dynasties", "history_dynasty_handoffs",
    "history_teaching_receipts",
)
TEACHING_BUILD_KINDS = (
    "teaching_labels", "sector_roles", "leader_succession",
    "range_leaders", "structure_events", "dynasties",
)


def _count(con: duckdb.DuckDBPyConnection, table: str) -> int | str:
    try:
        return int(con.execute(f"SELECT count(*) FROM {table}").fetchone()[0])
    except duckdb.Error as exc:
        return f"<不可读: {type(exc).__name__}>"


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--labels-db", required=True, help="旁路库路径，例如 db/history_labels.duckdb")
    args = ap.parse_args()

    path = Path(args.labels_db).expanduser()
    if not path.is_file():
        print(f"旁路库不存在: {path}")
        return 2

    out: dict[str, object] = {
        "labels_db": str(path),
        "bytes": path.stat().st_size,
        "read_only": True,
        "writes": "none",
    }
    con = duckdb.connect(str(path), read_only=True)
    try:
        present = {r[0] for r in con.execute("SHOW TABLES").fetchall()}
        out["tables_present"] = sorted(present)

        # 1) 行数：legacy 与教学分开数。273MB 的库不可能只有 432 行日历 ——
        #    看 legacy 那组吃掉了多少，可以证明「空的是教学部分，不是整个旁路库」。
        out["legacy_rows"] = {t: _count(con, t) for t in LEGACY_TABLES if t in present}
        out["teaching_rows"] = {t: _count(con, t) for t in TEACHING_TABLES if t in present}

        # 2) ★决定性的一张★：history_build_meta 每次构建写一行（store.write_meta）。
        #    审计没查这张。没有教学 build_kind = 教学构建从来没完成过。
        if "history_build_meta" in present:
            rows = con.execute(
                "SELECT build_kind, label_version, row_count, computed_at, source_max_trade_date "
                "FROM history_build_meta ORDER BY build_kind"
            ).fetchall()
            out["build_meta"] = [
                {"build_kind": r[0], "label_version": r[1], "row_count": r[2],
                 "computed_at": str(r[3]), "source_max_trade_date": str(r[4])}
                for r in rows
            ]
            recorded = {r[0] for r in rows}
            out["teaching_builds_recorded"] = sorted(recorded & set(TEACHING_BUILD_KINDS))
            out["teaching_builds_missing"] = sorted(set(TEACHING_BUILD_KINDS) - recorded)
        else:
            out["build_meta"] = "<history_build_meta 不存在>"

        # 3) 教学表的列集合（拿去和当前代码的 TEACHING_DDL 比；不一致 → 构建会
        #    在 _open_sidecar_for_write 里 raise RuntimeError「旁路库 schema 过期」）
        out["teaching_columns"] = {
            t: [r[1] for r in con.execute(f"PRAGMA table_info('{t}')").fetchall()]
            for t in TEACHING_TABLES if t in present
        }

        # 4) 如果教学标签表其实有行，顺便看戳记分布 —— 这是另一个问题
        #    （重建把所有历史行的 computed_at 刷成同一个时刻 → 过不了河的 PIT 闸）
        if out.get("teaching_rows", {}).get("history_teaching_labels"):
            out["computed_at_distribution"] = [
                {"computed_at": str(r[0]), "rows": r[1], "min_trade_date": str(r[2]), "max_trade_date": str(r[3])}
                for r in con.execute(
                    "SELECT computed_at, count(*), min(trade_date), max(trade_date) "
                    "FROM history_teaching_labels GROUP BY computed_at ORDER BY computed_at"
                ).fetchall()
            ]
    finally:
        con.close()

    print(json.dumps(out, ensure_ascii=False, indent=2, default=str))

    # 结论（只在证据足够时下，否则明说不足）
    print("\n--- 判读 ---")
    meta = out.get("build_meta")
    if not isinstance(meta, list):
        print("history_build_meta 不存在 —— 无法区分 A/B，请把上面 JSON 发回。")
    elif out.get("teaching_builds_recorded"):
        print(f"教学构建跑过: {out['teaching_builds_recorded']}")
        print("但表是 0 行 ⇒ 情形 B：跑过之后被清空（reset_teaching_tables 或换库）。")
        print("下一步看这些 build_kind 的 computed_at 是否早于库文件的 mtime。")
    else:
        print("history_build_meta 里**没有任何教学 build_kind** ⇒ 情形 A：")
        print("  scripts/teaching_framework.py 的 6 个 build-* 命令从未对这个库跑完过。")
        print("  10 张空教学表是 legacy 构建经由 ensure_schema 顺手建出来的。")
        print("  ⇒ 不是数据丢了，是这批标签在这个库里从来没算过。")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
