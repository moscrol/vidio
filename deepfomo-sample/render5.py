#!/usr/bin/env python3
"""Render anim5.html to frames via Playwright and encode MP4."""
import asyncio, os, sys
from playwright.async_api import async_playwright

FPS = 30
DUR = 74.92
OUT = "/home/ubuntu/deepfomo-video/frames"

async def main():
    os.makedirs(OUT, exist_ok=True)
    async with async_playwright() as pw:
        browser = await pw.chromium.launch()
        page = await browser.new_page(viewport={"width": 1080, "height": 1920})
        await page.goto("file:///home/ubuntu/deepfomo-video/anim5.html")
        await page.wait_for_timeout(500)
        n = int(DUR * FPS)
        for i in range(n):
            t = i / FPS
            await page.evaluate(f"window.seek({t})")
            await page.screenshot(path=f"{OUT}/f{i:05d}.png")
            if i % 100 == 0:
                print(f"{i}/{n}", flush=True)
        await browser.close()

asyncio.run(main())
