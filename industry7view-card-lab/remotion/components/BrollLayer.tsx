import { AbsoluteFill, Img, Sequence, Video, interpolate, staticFile, useCurrentFrame } from 'remotion';

export type BrollMotion =
  | 'kenBurns'
  | 'zoomIn'
  | 'zoomOut'
  | 'panLeft'
  | 'panRight'
  | 'panUp'
  | 'panDown'
  | 'still';

export type BrollSegment = {
  startInFrames: number;
  durationInFrames: number;
  src: string;
  /** 'video' (mp4/mov/webm) 或 'image' (jpg/png/webp) */
  kind?: 'video' | 'image';
  fit?: 'cover' | 'contain';
  opacity?: number;
  fadeInFrames?: number;
  fadeOutFrames?: number;
  /** B-roll 内部从第几秒开始播放（仅 video，用于跳过素材片头空帧） */
  trimStartInFrames?: number;
  /** 仅图片：动效类型，默认 kenBurns */
  motion?: BrollMotion;
};

const IMAGE_EXT = /\.(jpg|jpeg|png|webp|avif|gif)$/i;

function guessKind(seg: BrollSegment): 'video' | 'image' {
  if (seg.kind) return seg.kind;
  return IMAGE_EXT.test(seg.src) ? 'image' : 'video';
}

// 克制研究感 Ken Burns 参数
const KEN_BURNS_ZOOM_RANGE = 0.035; // 3.5% 缩放范围
const KEN_BURNS_PAN_PX = 28;        // 28px 平移范围

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * 克制研究感 Ken Burns：缓慢 zoom + 微平移，全程缓动。
 * 不同 motion 类型映射到不同 zoom/pan 起止值。
 */
function computeImageTransform(motion: BrollMotion, progress: number): string {
  const eased = easeInOutCubic(progress);

  let scale = 1;
  let tx = 0;
  let ty = 0;

  switch (motion) {
    case 'kenBurns': {
      // 1.0 → 1.035，同时向右上微移
      scale = 1 + KEN_BURNS_ZOOM_RANGE * eased;
      tx = -KEN_BURNS_PAN_PX * eased * 0.4;
      ty = -KEN_BURNS_PAN_PX * eased * 0.3;
      break;
    }
    case 'zoomIn': {
      scale = 1 + KEN_BURNS_ZOOM_RANGE * 1.8 * eased;
      break;
    }
    case 'zoomOut': {
      scale = 1 + KEN_BURNS_ZOOM_RANGE * 1.8 * (1 - eased);
      break;
    }
    case 'panLeft': {
      scale = 1 + KEN_BURNS_ZOOM_RANGE * 0.5;
      tx = KEN_BURNS_PAN_PX * 1.8 * (0.5 - eased);
      break;
    }
    case 'panRight': {
      scale = 1 + KEN_BURNS_ZOOM_RANGE * 0.5;
      tx = -KEN_BURNS_PAN_PX * 1.8 * (0.5 - eased);
      break;
    }
    case 'panUp': {
      scale = 1 + KEN_BURNS_ZOOM_RANGE * 0.5;
      ty = KEN_BURNS_PAN_PX * 1.8 * (0.5 - eased);
      break;
    }
    case 'panDown': {
      scale = 1 + KEN_BURNS_ZOOM_RANGE * 0.5;
      ty = -KEN_BURNS_PAN_PX * 1.8 * (0.5 - eased);
      break;
    }
    case 'still':
    default:
      break;
  }

  return `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${scale.toFixed(4)})`;
}

function useFadeOpacity(segment: BrollSegment) {
  const frame = useCurrentFrame();
  const fadeIn = segment.fadeInFrames ?? 6;
  const fadeOut = segment.fadeOutFrames ?? 6;
  const duration = segment.durationInFrames;

  return (
    interpolate(
      frame,
      [0, fadeIn, Math.max(duration - fadeOut, fadeIn + 1), duration],
      [0, 1, 1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    ) * (segment.opacity ?? 1)
  );
}

function FadingVideo({ segment }: { segment: BrollSegment }) {
  const opacity = useFadeOpacity(segment);
  const objectFit = segment.fit ?? 'cover';

  return (
    <AbsoluteFill style={{ opacity, background: '#000' }}>
      <Video
        src={staticFile(segment.src.replace(/^\//, ''))}
        startFrom={segment.trimStartInFrames ?? 0}
        muted
        style={{
          width: '100%',
          height: '100%',
          objectFit,
        }}
      />
    </AbsoluteFill>
  );
}

function AnimatedImage({ segment }: { segment: BrollSegment }) {
  const frame = useCurrentFrame();
  const opacity = useFadeOpacity(segment);
  const objectFit = segment.fit ?? 'cover';
  const motion = segment.motion ?? 'kenBurns';
  const progress = Math.min(Math.max(frame / Math.max(segment.durationInFrames - 1, 1), 0), 1);
  const transform = computeImageTransform(motion, progress);

  return (
    <AbsoluteFill style={{ opacity, background: '#000', overflow: 'hidden' }}>
      <Img
        src={staticFile(segment.src.replace(/^\//, ''))}
        style={{
          width: '100%',
          height: '100%',
          objectFit,
          transform,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      />
    </AbsoluteFill>
  );
}

/**
 * B-roll 层：覆盖口播视频画面，但口播音频继续在底层 TalkingHeadLayer 播放。
 * 支持视频（mp4/mov/webm）和图片（jpg/png/webp）。
 * - 视频自身静音，避免与口播音轨冲突。
 * - 图片自动叠加 Ken Burns 缓慢运动，避免静态死板。
 */
export function BrollLayer({ segments }: { segments: BrollSegment[] }) {
  if (!segments || segments.length === 0) return null;

  return (
    <>
      {segments.map((seg, i) => {
        const kind = guessKind(seg);
        return (
          <Sequence
            key={`broll-${i}-${seg.startInFrames}`}
            from={seg.startInFrames}
            durationInFrames={seg.durationInFrames}
          >
            {kind === 'image' ? (
              <AnimatedImage segment={seg} />
            ) : (
              <FadingVideo segment={seg} />
            )}
          </Sequence>
        );
      })}
    </>
  );
}
