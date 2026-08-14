import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { ease, elasticSpring } from './motion';
import { CardShell } from './CardShell';
import type { OrderValidationCard, Segment } from './types';

/**
 * OrderValidation 卡：与静态 PNG 05-business-loop（orderValidation type）对齐
 * - 标题左上 anchor + 金色短横下划线
 * - 5 个 stage-item 紧凑列表，每条带金色左边条
 * - 状态：done(灰)/current(navy+gold border)/next(虚线)/risk(red)
 * - verdict-box 在底部带金色 top border
 * - 隐藏全局 rail
 */
export function OrderValidationMotion({ segment, card }: { segment: Segment; card: OrderValidationCard }) {
  const frame = useCurrentFrame();
  const duration = segment.durationInFrames;
  const stages = card.stages || [];

  const opacity = interpolate(frame, [0, 10, Math.max(duration - 8, 11), duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleSpring = elasticSpring(frame, 4);
  const titleY = interpolate(titleSpring, [0, 1], [24, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);
  const verdictSpring = elasticSpring(frame, 70 + stages.length * 10, 30, 140, 12, 0.9);
  const verdictOpacity = interpolate(verdictSpring, [0, 1], [0, 1]);

  return (
    <div style={{ width: '100%', height: '100%', opacity }}>
      <CardShell tag={card.tag} footer={card.footer} showRail={false}>
        {/* 标题 */}
        <div
          style={{
            position: 'absolute',
            top: 300,
            left: 96,
            right: 84,
            color: '#0f2747',
            fontSize: 84,
            fontWeight: 900,
            lineHeight: 1.18,
            letterSpacing: '-0.06em',
            zIndex: 2,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
          }}
        >
          {card.title}
          <div style={{ background: '#b8832d', height: 9, marginTop: 36, width: 108 }} />
        </div>

        {/* stages-list */}
        <div
          style={{
            position: 'absolute',
            top: 522,
            left: 96,
            right: 84,
            display: 'grid',
            gap: 24,
            zIndex: 2,
          }}
        >
          {stages.map((stage, index) => {
            const startFrame = 22 + index * 10;
            const stageSpring = elasticSpring(frame, startFrame, 30, 90, 18, 0.85);
            const stageOpacity = interpolate(stageSpring, [0, 1], [0, 1]);
            const stageX = interpolate(stageSpring, [0, 1], [-32, 0]);

            let bg: string = 'rgba(255,255,255,0.96)';
            let border = '3px solid rgba(15,39,71,0.16)';
            let borderLeft = '9px solid rgba(184,131,45,0.55)';
            let textColor = '#0f2747';
            let descColor = '#6b7280';
            let opacityVal = 1;
            let numColor = '#b8832d';
            let statusColor = '#8a94a6';
            let statusText = 'next';

            if (stage.status === 'done') {
              bg = '#f3f4f6';
              border = '3px solid #d1d5db';
              borderLeft = '9px solid rgba(184,131,45,0.55)';
              textColor = '#4b5563';
              descColor = '#9ca3af';
              opacityVal = 0.65;
              numColor = '#5f6b7a';
              statusColor = '#5f6b7a';
              statusText = '✓ done';
            } else if (stage.status === 'current') {
              bg = '#0f2747';
              border = '3px solid #b8832d';
              borderLeft = '9px solid #b8832d';
              textColor = '#fff';
              descColor = 'rgba(255,255,255,0.72)';
              numColor = '#b8832d';
              statusColor = '#b8832d';
              statusText = 'active';
            } else if (stage.status === 'next') {
              bg = 'transparent';
              border = '3px dashed rgba(15,39,71,0.30)';
              borderLeft = '9px solid rgba(15,39,71,0.18)';
              textColor = '#5f6b7a';
              descColor = '#9ca3af';
              numColor = '#5f6b7a';
              statusColor = '#5f6b7a';
              statusText = 'next';
            } else if (stage.status === 'risk') {
              bg = '#e53935';
              border = '3px solid #e53935';
              borderLeft = '9px solid #fff';
              textColor = '#fff';
              descColor = 'rgba(255,255,255,0.8)';
              numColor = '#fff';
              statusColor = '#fff';
              statusText = 'risk';
            }

            return (
              <div
                key={`${stage.label}-${index}`}
                style={{
                  alignItems: 'center',
                  background: bg,
                  border,
                  borderLeft,
                  display: 'grid',
                  gap: 36,
                  gridTemplateColumns: '72px 1fr 168px',
                  minHeight: 150,
                  padding: '27px 42px',
                  opacity: stageOpacity * opacityVal,
                  transform: `translateX(${stageX}px)`,
                }}
              >
                <span
                  style={{
                    fontFamily: '"JetBrains Mono", SFMono-Regular, Menlo, monospace',
                    fontSize: 42,
                    fontWeight: 900,
                    color: numColor,
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div
                    style={{
                      fontSize: 48,
                      fontWeight: 900,
                      letterSpacing: '-0.03em',
                      lineHeight: 1.15,
                      color: textColor,
                    }}
                  >
                    {stage.label}
                  </div>
                  {stage.desc && (
                    <div style={{ fontSize: 33, fontWeight: 700, color: descColor, marginTop: 6 }}>
                      {stage.desc}
                    </div>
                  )}
                </div>
                <div
                  style={{
                    fontFamily: '"JetBrains Mono", SFMono-Regular, Menlo, monospace',
                    fontSize: 30,
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    textAlign: 'right',
                    letterSpacing: '0.05em',
                    color: statusColor,
                  }}
                >
                  {statusText}
                </div>
              </div>
            );
          })}
        </div>

        {/* verdict-box */}
        {card.verdict && (
          <div
            style={{
              position: 'absolute',
              left: 96,
              right: 84,
              bottom: 210,
              borderTop: '3px solid #b8832d',
              paddingTop: 30,
              zIndex: 2,
              opacity: verdictOpacity,
            }}
          >
            <div
              style={{
                color: '#0f2747',
                fontSize: 48,
                fontWeight: 900,
                letterSpacing: '-0.03em',
                textAlign: 'center',
              }}
            >
              {card.verdict}
            </div>
          </div>
        )}
      </CardShell>
    </div>
  );
}
