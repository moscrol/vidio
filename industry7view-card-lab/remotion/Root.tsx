import { Composition } from 'remotion';
import { CardDeckVideo } from './CardDeckVideo';
import { cardVideoData } from './generated/card-video-data';

export function RemotionRoot() {
  return (
    <Composition
      id="CardDeckVideo"
      component={CardDeckVideo}
      durationInFrames={cardVideoData.durationInFrames}
      fps={cardVideoData.fps}
      width={cardVideoData.width}
      height={cardVideoData.height}
    />
  );
}
