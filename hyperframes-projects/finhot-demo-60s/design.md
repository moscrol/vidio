# Design Spec — learned from reference video (影视飓风《剪辑全能必修课》第一课)

Source: /home/ubuntu/marketing-video/reference/ref.mp4 (10:37, 2560×1440)

## Palette
- Stage: deep violet-black `#0d0618` → `#1c0f33` (radial, darker at edges)
- Primary brand accent (FinHot): orange `#ff6b35` → `#ffb347`
- Ambient secondary: violet `#7c3aed` / `#8b5cf6` (glow borders, breadcrumb pill, corner glows)
- Gradient pill set (decorative 3D bricks): orange `#ff9a3c`, magenta `#e14fff`, cyan `#4ff0c8`, blue `#3b6cff`, violet `#8b5cf6`
- Text: pure white headlines; subtitles white with drop shadow, **no box**
- CTA button: solid mint `#6fe3c8` with dark text (reference 导出 button) — adapted to orange gradient for brand

## Signature elements (from reference)
1. **Concentric thin rings** + faint corner glows + top-edge ruler tick marks on every graphic scene
2. **3D glossy gradient pills/bricks** floating in space — used both as decoration and as diagram units (素材1/素材2, 辅轨); some carry a white waveform texture
3. **Headline with selection-box outline** — thin 1px white bounding box with corner handles around the main title (editing-software metaphor)
4. **Breadcrumb chips top-left**: violet capsule (course name) + white capsule (section name), side by side
5. **Screenshot cards**: rounded 16-20px corners, 2px violet border + outer purple glow, floating on stage with slow push-in
6. **Subtitles**: bottom-center, bold white, drop shadow only — no background box
7. Motion vocabulary: pills pop/slide with `back.out` ease, slow ambient drift on decorations, camera push-in on cards, label bars wipe in, stagger everywhere

## Type
- Headlines: 900 weight, white, tight leading; secondary line lighter weight
- Labels/chips: 700 weight, small caps feel
- Font: Noto Sans CJK SC (local)

## Layout rules (1080×1920 vertical)
- Breadcrumb top-left at 54px inset; disclaimer top-right small 30px muted
- Headline block upper third; screenshot card middle; diagram pills lower third
- Subtitles at bottom 150px, clear of content
