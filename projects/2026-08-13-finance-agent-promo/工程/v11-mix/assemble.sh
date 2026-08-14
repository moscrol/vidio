#!/usr/bin/env bash
# v11 混剪 R7：切点钉真实鼓点 + 电影系 SFX 钉帧（video-shotcraft 方法论）
# 节拍依据 beats/shared/bgm/tonight-hiphop.mp3.json：
#   10.002 / 16.002 / 22.002 / 30.002 本就在拍上；5.0 与 27.0 卡半拍，
#   移到真实瞬态 5.145 / 26.859（±0.15s，A 卷窗口同步平移）。
# SFX 词汇：whoosh(切点) / impact(落地) / riser→impact(收束三拍) / sweep(段内切) / sparkle(余韵)
# 钉帧一律按素材内部峰值对齐（whoosh-fast 峰值@0.721s、impact-deep-whoosh@0.551s、
# impact-zoom-quick@0.414s、swoosh-quick@0.296s、sparkle@1.377s）；
# 轻素材提增益：whoosh-fast(-5.6dB)→0.70、sparkle(-14.2dB)→0.90。
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
SRC="$ROOT/成片"
BGM="$ROOT/工程/shared/bgm/tonight-hiphop.mp3"
SFX="$(cd "$ROOT/../.." && pwd)/.agents/skills/video-shotcraft/assets/audio/sfx"
OUT="${1:-$SRC/v11-mix.mp4}"

for f in \
  "$SRC/v02-bw-kinetic.mp4" "$SRC/v08-collage.mp4" "$SRC/finhot-demo.mp4" \
  "$SRC/v07-dataviz.mp4" "$SRC/v01-aurora-glass.mp4" "$SRC/v10-velvet.mp4" \
  "$BGM" \
  "$SFX/transition/whoosh-fast.mp3" "$SFX/transition/swoosh-quick.mp3" \
  "$SFX/impact/impact-zoom-quick.mp3" "$SFX/impact/impact-deep-whoosh.mp3" \
  "$SFX/riser/riser-cine.mp3" "$SFX/light/sparkle.mp3"
do
  [[ -f "$f" ]] || { echo "missing: $f" >&2; exit 1; }
done

mkdir -p "$(dirname "$OUT")"

# 切点（真实鼓点）：5.145 / 10.002 / 16.002 / 22.002 / 26.859；总长 30.000
ffmpeg -y \
  -i "$SRC/v02-bw-kinetic.mp4" \
  -i "$SRC/v08-collage.mp4" \
  -i "$SRC/finhot-demo.mp4" \
  -i "$SRC/v07-dataviz.mp4" \
  -i "$SRC/v01-aurora-glass.mp4" \
  -i "$SRC/v10-velvet.mp4" \
  -i "$BGM" \
  -i "$SFX/transition/whoosh-fast.mp3" \
  -i "$SFX/transition/whoosh-fast.mp3" \
  -i "$SFX/impact/impact-zoom-quick.mp3" \
  -i "$SFX/transition/swoosh-quick.mp3" \
  -i "$SFX/transition/whoosh-fast.mp3" \
  -i "$SFX/riser/riser-cine.mp3" \
  -i "$SFX/impact/impact-deep-whoosh.mp3" \
  -i "$SFX/light/sparkle.mp3" \
  -i "$SFX/transition/swoosh-quick.mp3" \
  -filter_complex "\
    [0:v]trim=start=0:end=5.145,setpts=PTS-STARTPTS,fps=30,format=rgba,drawbox=x=760:y=28:w=280:h=52:color=0x0D0D0C:t=fill:enable='lt(t,3.42)'[v0];\
    [1:v]trim=start=6.543:end=11.4,setpts=PTS-STARTPTS,fps=30,format=rgba,rgbashift=rh=14:bh=-12:enable='lt(n,5)'[v1];\
    [2:v]trim=start=0:end=6,setpts=PTS-STARTPTS,fps=30,format=rgba,rgbashift=rh=18:bh=-16:enable='lt(n,6)'[v2];\
    [3:v]trim=start=17.4:end=23.4,setpts=PTS-STARTPTS,fps=30,format=rgba,rgbashift=rh=12:bh=-10:enable='lt(n,5)'[v3];\
    [4:v]trim=start=22.002:end=26.859,setpts=PTS-STARTPTS,fps=30,format=rgba,rgbashift=rh=10:bh=-8:enable='lt(n,5)'[v4];\
    [5:v]trim=start=26.859:end=30,setpts=PTS-STARTPTS,fps=30,format=rgba,rgbashift=rh=8:bh=-8:enable='lt(n,4)',delogo=x=60:y=1828:w=400:h=58:show=0[v5];\
    [v0][v1][v2][v3][v4][v5]concat=n=6:v=1:a=0,format=yuv420p[vcat];\
    color=c=white@0.72:s=1080x1920:d=30:r=30,format=yuva420p[flash];\
    [vcat][flash]overlay=0:0:eof_action=pass:enable='between(t,5.112,5.212)+between(t,9.969,10.069)+between(t,15.969,16.069)+between(t,21.969,22.069)+between(t,26.826,26.926)'[vout];\
    [6:a]atrim=0:30,asetpts=PTS-STARTPTS,volume=0.38,afade=t=in:st=0:d=1,afade=t=out:st=28.3:d=1.7[bgm];\
    [7:a]volume=0.70,adelay=4424|4424[sx1];\
    [8:a]volume=0.70,adelay=9281|9281[sx2];\
    [9:a]volume=0.40,adelay=9588|9588[sx3];\
    [10:a]volume=0.50,adelay=15706|15706[sx4];\
    [11:a]volume=0.70,adelay=21281|21281[sx5];\
    [12:a]volume=0.42,adelay=22002|22002[sx6];\
    [13:a]volume=0.72,adelay=26308|26308[sx7];\
    [14:a]atrim=0:1.9,afade=t=out:st=1.4:d=0.5,volume=0.90,adelay=26673|26673[sx8];\
    [15:a]volume=0.45,adelay=12906|12906[sx9];\
    [bgm][sx1][sx2][sx3][sx4][sx5][sx6][sx7][sx8][sx9]amix=inputs=10:duration=first:normalize=0,\
      aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo[aout]\
  " \
  -map "[vout]" -map "[aout]" \
  -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -r 30 \
  -c:a aac -b:a 192k -ar 48000 -ac 2 \
  -movflags +faststart \
  -t 30 \
  "$OUT"

echo "wrote $OUT"
ffprobe -v error -show_entries format=duration -show_entries stream=codec_type,codec_name,width,height,avg_frame_rate,nb_frames -of compact "$OUT"
