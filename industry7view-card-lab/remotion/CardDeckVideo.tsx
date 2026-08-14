import { AbsoluteFill, Img, Sequence, Video, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { BusinessLoopMotion } from './components/BusinessLoopMotion';
import { CompareMotion } from './components/CompareMotion';
import { DataHeroMotion } from './components/DataHeroMotion';
import { OrderValidationMotion } from './components/OrderValidationMotion';
import { SupplyChainShiftMotion } from './components/SupplyChainShiftMotion';
import { CoverMotion } from './components/CoverMotion';
import { HookMotion } from './components/HookMotion';
import { LogisticsMotion } from './components/LogisticsMotion';
import { ChecklistMotion } from './components/ChecklistMotion';
import { EvidenceGridMotion } from './components/EvidenceGridMotion';
import { QuoteMotion } from './components/QuoteMotion';
import { IntroSequence } from './components/IntroSequence';
import { OutroSequence } from './components/OutroSequence';
import { BrandWatermark } from './components/BrandWatermark';
import { BrollLayer } from './components/BrollLayer';
import { backgroundStyle, cardImageStyle, cardShellStyle, talkingHeadStyle } from './components/styles';
import type {
  BusinessLoopCard,
  CompareCard,
  DataHeroCard,
  OrderValidationCard,
  SupplyChainShiftCard,
  CoverCard,
  HookCard,
  LogisticsCard,
  ChecklistCard,
  EvidenceGridCard,
  QuoteCard,
  Segment,
} from './components/types';
import { cardVideoData } from './generated/card-video-data';

function isCoverCard(card: Segment['card']): card is CoverCard {
  return Boolean(card && card.type === 'cover');
}

function isHookCard(card: Segment['card']): card is HookCard {
  return Boolean(card && card.type === 'hook');
}

function isLogisticsCard(card: Segment['card']): card is LogisticsCard {
  return Boolean(card && card.type === 'logistics');
}

function isQuoteCard(card: Segment['card']): card is QuoteCard {
  return Boolean(card && card.type === 'quote');
}

function isDataHeroCard(card: Segment['card']): card is DataHeroCard {
  return Boolean(card && card.type === 'dataHero');
}

function isCompareCard(card: Segment['card']): card is CompareCard {
  return Boolean(card && card.type === 'compare');
}

function isBusinessLoopCard(card: Segment['card']): card is BusinessLoopCard {
  return Boolean(card && card.type === 'loop');
}

function isOrderValidationCard(card: Segment['card']): card is OrderValidationCard {
  return Boolean(card && card.type === 'orderValidation');
}

function isSupplyChainShiftCard(card: Segment['card']): card is SupplyChainShiftCard {
  return Boolean(card && card.type === 'supplyChainShift');
}

function isChecklistCard(card: Segment['card']): card is ChecklistCard {
  return Boolean(card && card.type === 'checklist');
}

function isEvidenceGridCard(card: Segment['card']): card is EvidenceGridCard {
  return Boolean(card && card.type === 'evidenceGrid');
}

function TalkingHeadLayer() {
  if (!cardVideoData.talkingHeadVideoPath) {
    return null;
  }
  const startInFrames = cardVideoData.talkingHeadStartInFrames || 0;
  const durationInFrames =
    cardVideoData.talkingHeadDurationInFrames || cardVideoData.durationInFrames;

  return (
    <Sequence from={startInFrames} durationInFrames={durationInFrames}>
      <AbsoluteFill>
        <Video
          src={staticFile(cardVideoData.talkingHeadVideoPath.replace(/^\//, ''))}
          style={talkingHeadStyle}
        />
      </AbsoluteFill>
    </Sequence>
  );
}

function AnimatedCard({ segment }: { segment: Segment }) {
  const frame = useCurrentFrame();
  const duration = segment.durationInFrames;
  const opacity = interpolate(
    frame,
    [0, 10, Math.max(duration - 8, 11), duration],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const translateY = interpolate(frame, [0, 14], [22, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const entryScale = interpolate(frame, [0, 18], [1.018, 1.026], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const holdProgress = Math.min(Math.max((frame - 18) / Math.max(duration - 34, 1), 0), 1);
  const breathe = Math.sin(holdProgress * Math.PI) * 0.012;
  const driftY = Math.sin(holdProgress * Math.PI * 1.5) * -8;
  const scale = entryScale + breathe;
  const y = translateY + driftY;

  return (
    <AbsoluteFill style={backgroundStyle}>
      <div style={cardShellStyle}>
        <Img
          src={staticFile(segment.assetPath.replace(/^\//, ''))}
          style={{
            ...cardImageStyle,
            opacity,
            transform: `translateY(${y}px) scale(${scale})`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
}

function CardRenderer({ segment }: { segment: Segment }) {
  if (segment.renderMode === 'native' && isCoverCard(segment.card)) {
    return <CoverMotion segment={segment} card={segment.card} />;
  }

  if (segment.renderMode === 'native' && isHookCard(segment.card)) {
    return <HookMotion segment={segment} card={segment.card} />;
  }

  if (segment.renderMode === 'native' && isLogisticsCard(segment.card)) {
    return <LogisticsMotion segment={segment} card={segment.card} />;
  }

  if (segment.renderMode === 'native' && isQuoteCard(segment.card)) {
    return <QuoteMotion segment={segment} card={segment.card} />;
  }

  if (segment.renderMode === 'native' && isDataHeroCard(segment.card)) {
    return <DataHeroMotion segment={segment} card={segment.card} />;
  }

  if (segment.renderMode === 'native' && isCompareCard(segment.card)) {
    return <CompareMotion segment={segment} card={segment.card} />;
  }

  if (segment.renderMode === 'native' && isBusinessLoopCard(segment.card)) {
    return <BusinessLoopMotion segment={segment} card={segment.card} />;
  }

  if (segment.renderMode === 'native' && isOrderValidationCard(segment.card)) {
    return <OrderValidationMotion segment={segment} card={segment.card} />;
  }

  if (segment.renderMode === 'native' && isSupplyChainShiftCard(segment.card)) {
    return <SupplyChainShiftMotion segment={segment} card={segment.card} />;
  }

  if (segment.renderMode === 'native' && isChecklistCard(segment.card)) {
    return <ChecklistMotion segment={segment} card={segment.card} />;
  }

  if (segment.renderMode === 'native' && isEvidenceGridCard(segment.card)) {
    return <EvidenceGridMotion segment={segment} card={segment.card} />;
  }

  return <AnimatedCard segment={segment} />;
}

/**
 * 字幕层：覆盖讲解员视频里烧录的白色细字幕，用大字号 + 黑色描边 + 半透明深色背板，
 * 保证在白衣 / 浅色背景下也清晰可读。位置覆盖原始烧录区。
 */
function SubtitleOverlay() {
  const frame = useCurrentFrame();
  const cue = cardVideoData.subtitles.find(
    (c) => frame >= c.startInFrames && frame < c.endInFrames
  );
  if (!cue) return null;

  // 进入小幅 fade-up
  const localFrame = frame - cue.startInFrames;
  const opacity = interpolate(localFrame, [0, 4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const translateY = interpolate(localFrame, [0, 6], [10, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 340,
      }}
    >
      <div
        style={{
          maxWidth: 960,
          padding: '30px 52px',
          background: 'rgba(15, 39, 71, 0.88)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderRadius: 18,
          boxShadow:
            '0 18px 48px rgba(15, 39, 71, 0.35), 0 4px 14px rgba(0, 0, 0, 0.18)',
          color: '#ffffff',
          fontFamily: '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif',
          fontSize: 50,
          fontWeight: 800,
          letterSpacing: '0.02em',
          lineHeight: 1.3,
          textAlign: 'center',
          textShadow: '0 2px 6px rgba(0,0,0,0.6), 0 0 2px rgba(0,0,0,0.9)',
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        {cue.text}
      </div>
    </AbsoluteFill>
  );
}

export function CardDeckVideo() {
  const publish = cardVideoData.publish;
  const publishEnabled = publish && publish.enabled;

  return (
    <AbsoluteFill style={backgroundStyle}>
      {/* 片头：仅发布模式 */}
      {publishEnabled ? (
        <Sequence from={0} durationInFrames={publish.introDurationInFrames}>
          <IntroSequence
            data={publish.intro}
            durationInFrames={publish.introDurationInFrames}
          />
        </Sequence>
      ) : null}

      {/* 主体：口播 + B-roll 覆盖 + 卡片 + 字幕 */}
      <TalkingHeadLayer />
      <BrollLayer segments={cardVideoData.brolls || []} />
      <AbsoluteFill>
        {cardVideoData.segments.map((segment) => (
          <Sequence
            key={segment.cardId}
            from={segment.startInFrames}
            durationInFrames={segment.durationInFrames}
          >
            <CardRenderer segment={segment} />
          </Sequence>
        ))}
      </AbsoluteFill>
      <SubtitleOverlay />

      {/* 片尾：仅发布模式 */}
      {publishEnabled ? (
        <Sequence
          from={publish.outroStartInFrames}
          durationInFrames={publish.outroDurationInFrames}
        >
          <OutroSequence
            data={publish.outro}
            durationInFrames={publish.outroDurationInFrames}
          />
        </Sequence>
      ) : null}

      {/* 全程品牌水印：仅发布模式，且片头片尾区不显示（避免与封面/CTA 冲突） */}
      {publishEnabled ? (
        <Sequence
          from={publish.introDurationInFrames}
          durationInFrames={publish.outroStartInFrames - publish.introDurationInFrames}
        >
          <BrandWatermark brand={publish.brand} slug={publish.slug} />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
}
