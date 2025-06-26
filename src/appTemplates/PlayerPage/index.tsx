'use client';
import { useEffect, useRef, useState } from 'react';
import { LoadingWrapper } from './LoadingWrapper';

export const PlayerPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(true);
  console.log('loading', loading);

  useEffect(() => {
    // 按下空格触发播放暂停
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === ' ' && videoRef.current) {
        console.log('keydown', paused);
        videoRef.current[paused ? 'play' : 'pause']?.();
      }
    };
    document.body.addEventListener('keydown', onKeydown);
    return () => document.body.removeEventListener('keydown', onKeydown);
  }, [paused]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, []);

  return (
    <div className="w-screen h-screen">
      <div>
        <LoadingWrapper loading={loading} tip="加载中...">
          <video
            className="w-full h-full"
            ref={videoRef}
            src="/test-video.mp4"
            onLoadedMetadata={() => setLoading(false)}
            onPause={() => setPaused(true)}
            onPlay={() => setPaused(false)}
          />
        </LoadingWrapper>
      </div>
    </div>
  );
};
