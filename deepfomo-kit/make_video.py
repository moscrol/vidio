#!/usr/bin/env python3
"""一键渲染：content.md -> content.js -> 逐帧截图 -> 合成音效 -> MP4

用法：python3 make_video.py [content.md] [out.mp4]
依赖：pip install playwright numpy && playwright install chromium；系统需有 ffmpeg
"""
import asyncio, json, math, os, subprocess, sys, wave

HERE = os.path.dirname(os.path.abspath(__file__))
FPS = 30
SR = 44100

async def render_frames(src_md, workdir):
    from playwright.async_api import async_playwright
    subprocess.run([sys.executable, os.path.join(HERE, 'build_content.py'),
                    src_md, os.path.join(HERE, 'content.js')], check=True)
    frames = os.path.join(workdir, 'frames')
    os.makedirs(frames, exist_ok=True)
    async with async_playwright() as pw:
        browser = await pw.chromium.launch()
        page = await browser.new_page(viewport={'width': 1080, 'height': 1920})
        await page.goto('file://' + os.path.join(HERE, 'template.html'))
        await page.wait_for_timeout(500)
        timing = await page.evaluate('window.TIMING')
        total = timing['total']
        n = int(total * FPS)
        for i in range(n):
            await page.evaluate(f'window.seek({i / FPS})')
            await page.screenshot(path=f'{frames}/f{i:05d}.png')
            if i % 300 == 0:
                print(f'{i}/{n}', flush=True)
        await browser.close()
    return timing, n

def synth_audio(timing, path):
    import numpy as np
    total = timing['total']
    buf = np.zeros(int(total * SR))

    def add(t, snd):
        i = int(t * SR)
        j = min(len(buf), i + len(snd))
        if i < len(buf): buf[i:j] += snd[:j - i]

    def click(dur=0.03, f=2600, amp=0.12):
        t = np.arange(int(dur * SR)) / SR
        return amp * np.sin(2 * np.pi * f * t) * np.exp(-t * 90)

    def pop(dur=0.12, f=700, amp=0.2):
        t = np.arange(int(dur * SR)) / SR
        return amp * np.sin(2 * np.pi * f * t) * np.exp(-t * 28)

    def tick(dur=0.05, f=1400, amp=0.09):
        t = np.arange(int(dur * SR)) / SR
        return amp * np.sin(2 * np.pi * f * t) * np.exp(-t * 60)

    # typing clicks
    a, b = timing['type_span']
    t = a
    rng = np.random.default_rng(7)
    while t < b:
        add(t, click(f=2200 + rng.uniform(-300, 500)))
        t += rng.uniform(0.07, 0.16)
    add(timing['submit'], pop(f=880, amp=0.25))
    # think line ticks
    for (s, _e) in timing['think']:
        add(s, tick())
    # paragraph soft pops during answer
    for (s, _e) in timing['ans']:
        add(s, tick(f=1000, amp=0.05))
    # ending pop
    add(timing['end_t'] + 0.4, pop(f=620, amp=0.22))

    buf = np.clip(buf, -1, 1)
    with wave.open(path, 'w') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((buf * 32767).astype(np.int16).tobytes())

def main():
    src = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'content.md')
    out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, 'out.mp4')
    workdir = os.path.join(HERE, '.work')
    os.makedirs(workdir, exist_ok=True)
    timing, n = asyncio.run(render_frames(src, workdir))
    print(f'total={timing["total"]:.1f}s frames={n}')
    audio = os.path.join(workdir, 'audio.wav')
    synth_audio(timing, audio)
    silent = os.path.join(workdir, 'silent.mp4')
    subprocess.run(['ffmpeg', '-y', '-framerate', str(FPS),
                    '-i', os.path.join(workdir, 'frames', 'f%05d.png'),
                    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18',
                    '-preset', 'medium', silent], check=True,
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    subprocess.run(['ffmpeg', '-y', '-i', silent, '-i', audio,
                    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '128k',
                    '-shortest', out], check=True,
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print('done:', out)

if __name__ == '__main__':
    main()
