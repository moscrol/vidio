import asyncio, subprocess, wave, os
import numpy as np
FPS=30; SR=44100
async def frames():
    from playwright.async_api import async_playwright
    os.makedirs('frames7', exist_ok=True)
    async with async_playwright() as pw:
        b=await pw.chromium.launch()
        p=await b.new_page(viewport={'width':1080,'height':1920})
        await p.goto('file:///home/ubuntu/deepfomo-video/anim7.html')
        await p.wait_for_timeout(400)
        t=await p.evaluate('window.TIMING')
        n=int(t['total']*FPS)
        for i in range(n):
            await p.evaluate(f'window.seek({i/FPS})')
            await p.screenshot(path=f'frames7/f{i:05d}.png')
            if i%300==0: print(i,n,flush=True)
        await b.close()
    return t,n
def audio(t,path):
    H=t['hook']; total=t['total']
    buf=np.zeros(int(total*SR))
    def add(tt,s):
        i=int(tt*SR); j=min(len(buf),i+len(s))
        if i<len(buf): buf[i:j]+=s[:j-i]
    def tone(dur,f,amp,dec):
        x=np.arange(int(dur*SR))/SR
        return amp*np.sin(2*np.pi*f*x)*np.exp(-x*dec)
    # hook impacts
    for k,tt in enumerate([0.15,0.75,1.35]):
        add(tt, tone(0.25,150+k*20,0.35,18)); add(tt, tone(0.08,900,0.12,60))
    # BGM pulse bed (soft) throughout
    beat=0.5; tt=0.0
    while tt<total-0.5:
        add(tt, tone(0.18,110,0.055,22)); tt+=beat
    # typing
    rng=np.random.default_rng(7); a,b=H+0.9,H+2.5; tt=a
    while tt<b:
        add(tt, tone(0.03,2200+rng.uniform(-300,500),0.12,90)); tt+=rng.uniform(0.07,0.16)
    add(H+3.5, tone(0.12,880,0.25,28))
    for (s,_e) in t['think']: add(H+s, tone(0.05,1400,0.09,60))
    for (s,_e) in t['ans']: add(H+s, tone(0.05,1000,0.05,60))
    add(H+t['end_t']+0.4, tone(0.12,620,0.22,28))
    buf=np.clip(buf,-1,1)
    with wave.open(path,'w') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((buf*32767).astype(np.int16).tobytes())
t,n=asyncio.run(frames())
print('total',t['total'],'frames',n)
audio(t,'audio7.wav')
subprocess.run(['ffmpeg','-y','-framerate','30','-i','frames7/f%05d.png','-c:v','libx264','-pix_fmt','yuv420p','-crf','18','silent7b.mp4'],check=True,capture_output=True)
subprocess.run(['ffmpeg','-y','-i','silent7b.mp4','-i','audio7.wav','-c:v','copy','-c:a','aac','-b:a','128k','-shortest','deepfomo_douyin_30s_9x16.mp4'],check=True,capture_output=True)
print('done')
