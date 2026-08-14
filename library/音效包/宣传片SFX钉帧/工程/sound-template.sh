#!/usr/bin/env bash
# v12 声音层：BGM 包络 + 电影系 SFX 钉帧（全按素材内部峰值对齐，见 design.md 分镜表）
# 峰值：whoosh-fast@0.721 swoosh-quick@0.296 impact-deep-whoosh@0.551 pop≈头部 riser 对齐终点 sparkle@1.377
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
BGM="$ROOT/工程/shared/bgm/tonight-hiphop.mp3"
SFX="$(cd "$ROOT/../.." && pwd)/.agents/skills/video-shotcraft/assets/audio/sfx"
IN="${1:-$ROOT/成片/v12-finhot-film.mp4}"
OUT="${2:-$ROOT/成片/v12-finhot-film.mp4}"
TMP="$(mktemp -u /tmp/v12-XXXX).mp4"

ffmpeg -y -i "$IN" \
  -i "$BGM" \
  -i "$SFX/transition/transition-soft.mp3" \
  -i "$SFX/transition/whoosh-fast.mp3" \
  -i "$SFX/transition/swoosh-quick.mp3" \
  -i "$SFX/transition/whoosh-fast.mp3" \
  -i "$SFX/transition/swoosh-quick.mp3" \
  -i "$SFX/transition/whoosh-fast.mp3" \
  -i "$SFX/transition/swoosh-quick.mp3" \
  -i "$SFX/ui/pop.mp3" -i "$SFX/ui/pop.mp3" -i "$SFX/ui/pop.mp3" -i "$SFX/ui/pop.mp3" -i "$SFX/ui/pop.mp3" \
  -i "$SFX/riser/riser-cine.mp3" \
  -i "$SFX/impact/impact-deep-whoosh.mp3" \
  -i "$SFX/light/sparkle.mp3" \
  -filter_complex "\
    [1:a]atrim=0:30,asetpts=PTS-STARTPTS,volume=0.38,afade=t=in:st=0:d=1,afade=t=out:st=28.3:d=1.7[bgm];\
    [2:a]volume=0.40,adelay=400|400[x0];\
    [3:a]volume=0.60,adelay=2424|2424[x1];\
    [4:a]volume=0.50,adelay=7706|7706[x2];\
    [5:a]volume=0.60,adelay=11281|11281[x3];\
    [6:a]volume=0.50,adelay=15706|15706[x4];\
    [7:a]volume=0.55,adelay=16995|16995[x5];\
    [8:a]volume=0.50,adelay=21706|21706[x6];\
    [9:a]volume=0.40,adelay=8650|8650[p1];\
    [10:a]volume=0.37,adelay=9050|9050[p2];\
    [11:a]volume=0.34,adelay=9380|9380[p3];\
    [12:a]volume=0.31,adelay=9640|9640[p4];\
    [13:a]volume=0.28,adelay=9840|9840[p5];\
    [14:a]volume=0.42,adelay=22050|22050[rs];\
    [15:a]volume=0.72,adelay=26308|26308[im];\
    [16:a]atrim=0:1.9,afade=t=out:st=1.4:d=0.5,volume=0.90,adelay=26773|26773[sp];\
    [bgm][x0][x1][x2][x3][x4][x5][x6][p1][p2][p3][p4][p5][rs][im][sp]amix=inputs=16:duration=first:normalize=0,\
      aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo[aout]\
  " \
  -map 0:v -map "[aout]" \
  -c:v copy -c:a aac -b:a 192k -ar 48000 -ac 2 \
  -movflags +faststart -t 30 \
  "$TMP"

mv "$TMP" "$OUT"
echo "wrote $OUT"
ffmpeg -i "$OUT" -af volumedetect -f null - 2>&1 | grep -E "mean_volume|max_volume"
