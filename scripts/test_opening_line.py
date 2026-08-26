#!/usr/bin/env python3
"""Gate: cover lane split, t=0 QC text, and the two opening scripts."""

from __future__ import annotations

import json
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MAP = json.loads((ROOT / ".agents/skills/vibe-director/lane-map.json").read_text())
PROMO = (ROOT / ".agents/skills/promo-film-pipeline/SKILL.md").read_text()
SKILL = (ROOT / ".agents/skills/vibe-director/SKILL.md").read_text()
BRIEF = (ROOT / ".agents/skills/vibe-director/templates/brief.md").read_text()


def test_cover_lane_is_editorial_only() -> None:
    cover = next(lane for lane in MAP["lanes"] if lane["id"] == "cover")
    assert "成片开幕" in cover["when"]
    assert "不算本车道" in cover["when"]
    assert "5:2" in cover["copy"]
    assert "不是成片第一帧" in cover["copy"]
    assert "给刚这支片子做一张 5:2 封面" not in cover["copy"]
    assert "用旁路 PNG 代替成片 t=0" in cover["refuse"]


def test_promo_step9_requires_t0() -> None:
    assert "质检/t0.png" in PROMO
    assert "check_opening_frame.py" in PROMO
    assert "pin_opening.py" in PROMO
    assert "fromTo(opacity:0)" in PROMO


def test_director_routes_film_cover_off_cover_lane() -> None:
    assert "成片封面 / 开幕 / 0:00 字标" in SKILL
    assert "不要**进封面图文车道" in SKILL
    assert "check_opening_frame.py" in SKILL
    assert "质检/t0.png" in BRIEF


def test_scripts_help() -> None:
    for name in ("check_opening_frame.py", "pin_opening.py"):
        result = subprocess.run(
            ["python3", str(ROOT / "scripts" / name), "--help"],
            capture_output=True,
            text=True,
        )
        assert result.returncode == 0, result.stderr


def test_extract_and_pin_smoke() -> None:
    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp)
        src = tmp_path / "src.mp4"
        pinned = tmp_path / "pinned.mp4"
        t0 = tmp_path / "t0.png"
        make = subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-hide_banner",
                "-loglevel",
                "error",
                "-f",
                "lavfi",
                "-i",
                "color=c=red:s=320x180:d=0.5",
                "-f",
                "lavfi",
                "-i",
                "color=c=blue:s=320x180:d=0.5",
                "-filter_complex",
                "[0:v][1:v]concat=n=2:v=1:a=0[v]",
                "-map",
                "[v]",
                str(src),
            ],
            capture_output=True,
            text=True,
        )
        assert make.returncode == 0, make.stderr
        extract = subprocess.run(
            ["python3", str(ROOT / "scripts/check_opening_frame.py"), str(src), "--out", str(t0)],
            capture_output=True,
            text=True,
        )
        assert extract.returncode == 0, extract.stderr
        assert t0.is_file() and t0.stat().st_size > 100
        pin = subprocess.run(
            [
                "python3",
                str(ROOT / "scripts/pin_opening.py"),
                "--input",
                str(src),
                "--at",
                "0.7",
                "--output",
                str(pinned),
            ],
            capture_output=True,
            text=True,
        )
        assert pin.returncode == 0, pin.stderr + pin.stdout
        assert pinned.is_file()


if __name__ == "__main__":
    test_cover_lane_is_editorial_only()
    test_promo_step9_requires_t0()
    test_director_routes_film_cover_off_cover_lane()
    test_scripts_help()
    test_extract_and_pin_smoke()
    print("PASS  opening-line")
