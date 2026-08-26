#!/usr/bin/env python3
"""Pin the settled opening frame back onto 0..T of an already-rendered film.

Remedy, not the source fix. The source fix is CSS-visible lockup + GSAP set().
Use this when the film is already rendered and you do not want a full rerender.
"""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path


def pin_opening(mp4: Path, at: float, out: Path) -> None:
    if at <= 0:
        raise SystemExit("--at must be > 0")
    if shutil.which("ffmpeg") is None:
        raise SystemExit("ffmpeg not found")
    out.parent.mkdir(parents=True, exist_ok=True)
    still = out.with_suffix(".pin-still.png")
    grab = subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-hide_banner",
            "-loglevel",
            "error",
            "-ss",
            f"{at:.3f}",
            "-i",
            str(mp4),
            "-frames:v",
            "1",
            "-update",
            "1",
            str(still),
        ],
        capture_output=True,
        text=True,
    )
    if grab.returncode != 0 or not still.is_file():
        raise SystemExit((grab.stderr or "could not grab --at frame").strip())

    bake = subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-hide_banner",
            "-loglevel",
            "error",
            "-i",
            str(mp4),
            "-i",
            str(still),
            "-filter_complex",
            f"[1:v][0:v]scale2ref[c][base];[base][c]overlay=0:0:enable='lte(t,{at:.3f})'[v]",
            "-map",
            "[v]",
            "-map",
            "0:a?",
            "-c:a",
            "copy",
            "-c:v",
            "libx264",
            "-crf",
            "18",
            "-preset",
            "fast",
            "-pix_fmt",
            "yuv420p",
            "-movflags",
            "+faststart",
            str(out),
        ],
        capture_output=True,
        text=True,
    )
    still.unlink(missing_ok=True)
    if bake.returncode != 0 or not out.is_file():
        raise SystemExit((bake.stderr or "pin failed").strip())


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Overlay the frame at --at onto 0..at. Audio is copied."
    )
    parser.add_argument("--input", type=Path, required=True)
    parser.add_argument("--at", type=float, required=True, help="seconds of the settled lockup")
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    src = args.input.expanduser().resolve()
    if not src.is_file():
        raise SystemExit(f"missing mp4: {src}")
    dest = args.output.expanduser().resolve()
    if dest == src:
        raise SystemExit("--output must be a new file; do not overwrite the input")
    pin_opening(src, args.at, dest)
    print(dest)
    return 0


if __name__ == "__main__":
    sys.exit(main())
