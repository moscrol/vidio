#!/usr/bin/env python3
"""Extract t=0 from a finished film so QC can see the opening lockup.

Failure shape: GSAP fromTo(opacity:0) hides frame 0; a sidecar PNG is not
the cover. This script only delivers the evidence frame — a human still
decides whether the lockup is settled.
"""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path


def extract_t0(mp4: Path, out: Path) -> None:
    if shutil.which("ffmpeg") is None:
        raise SystemExit("ffmpeg not found")
    out.parent.mkdir(parents=True, exist_ok=True)
    result = subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-hide_banner",
            "-loglevel",
            "error",
            "-ss",
            "0",
            "-i",
            str(mp4),
            "-frames:v",
            "1",
            "-update",
            "1",
            str(out),
        ],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0 or not out.is_file() or out.stat().st_size < 100:
        detail = (result.stderr or result.stdout or "extract failed").strip()
        raise SystemExit(f"t=0 extract failed: {detail}")


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Write 质检/t0.png from a finished mp4. Human checks the lockup."
    )
    parser.add_argument("mp4", type=Path, help="finished film")
    parser.add_argument(
        "--out",
        type=Path,
        default=None,
        help="output png (default: <project>/质检/t0.png or next to the mp4)",
    )
    args = parser.parse_args()
    mp4 = args.mp4.expanduser().resolve()
    if not mp4.is_file():
        raise SystemExit(f"missing mp4: {mp4}")

    out = args.out
    if out is None:
        project = mp4.parent.parent
        qc_dir = project / "质检"
        out = qc_dir / "t0.png" if qc_dir.parent == project else mp4.with_name("t0.png")
        if not (project / "brief.md").exists() and not qc_dir.is_dir():
            out = mp4.with_name("t0.png")
    out = out.expanduser().resolve()

    extract_t0(mp4, out)
    print(out)
    print("人检：开幕字标是否已落定。空纸 / 淡入中 = 未过门。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
