import { interpolate, spring } from 'remotion';

export function ease(frame: number, input: [number, number], output: [number, number]) {
  return interpolate(frame, input, output, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

/**
 * Premium physics spring curve with calibrated stiffness and damping
 * for luxury, organic feeling transitions.
 */
export function elasticSpring(
  frame: number,
  startFrame: number,
  fps: number = 30,
  stiffness: number = 100,
  damping: number = 16,
  mass: number = 0.8
) {
  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return 0;
  return spring({
    frame: relativeFrame,
    fps,
    config: {
      stiffness,
      damping,
      mass,
    },
  });
}

