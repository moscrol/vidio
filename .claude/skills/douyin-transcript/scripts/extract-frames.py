#!/usr/bin/env python3
"""Download Douyin video and extract frames at 3-second intervals."""
import sys, os, subprocess, cv2

def main():
    if len(sys.argv) < 2:
        print("Usage: extract-frames.py <video_url> [output_dir]")
        sys.exit(1)

    video_url = sys.argv[1]
    out_dir = sys.argv[2] if len(sys.argv) > 2 else "/tmp/douyin_frames"
    video_path = "/tmp/douyin_video.mp4"

    # Download
    result = subprocess.run([
        "curl", "-L", "-o", video_path,
        "-H", "Referer: https://www.douyin.com/",
        "-H", "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        video_url
    ], capture_output=True, text=True, timeout=120)

    # Verify
    size = os.path.getsize(video_path) if os.path.exists(video_path) else 0
    if size < 10000:
        print(f"ERROR: Downloaded file too small ({size} bytes). Likely missing Referer header.")
        sys.exit(1)

    # Read first bytes to verify MP4
    with open(video_path, "rb") as f:
        header = f.read(12)
    if b"html" in header.lower():
        print("ERROR: Downloaded HTML instead of video. Missing Referer header.")
        sys.exit(1)

    # Extract frames
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = total_frames / fps if fps > 0 else 0

    interval_sec = 3
    n_frames = int(duration / interval_sec)
    frame_step = int(fps * interval_sec)

    os.makedirs(out_dir, exist_ok=True)
    # Clean existing frames
    for f in os.listdir(out_dir):
        if f.startswith("frame_") and f.endswith(".png"):
            os.remove(os.path.join(out_dir, f))

    extracted = 0
    for i in range(n_frames):
        cap.set(cv2.CAP_PROP_POS_FRAMES, i * frame_step)
        ret, frame = cap.read()
        if ret:
            cv2.imwrite(f"{out_dir}/frame_{i:02d}.png", frame)
            extracted += 1
    cap.release()

    dur_min = int(duration // 60)
    dur_sec = int(duration % 60)
    print(f"OK: {dur_min}m{dur_sec}s | {extracted} frames @ {interval_sec}s interval -> {out_dir}/")

if __name__ == "__main__":
    main()
