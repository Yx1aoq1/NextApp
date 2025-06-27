'use client';
import { useEffect, useRef, useState } from 'react';
import { LoadingWrapper } from './LoadingWrapper';
import { useViewportScale } from '@/hooks/useViewportScale';

export const PlayerPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(true);
  const [taskFile, setTaskFile] = useState({
    width: 0,
    height: 0,
  });

  const { viewportRef, boxRect } = useViewportScale(taskFile, false);

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
    setTimeout(() => {
      setTaskFile({
        width: 960,
        height: 540,
      });
    }, 1000);
  }, []);

  return (
    <div className="w-screen h-screen flex justify-center items-center overflow-hidden">
      <div ref={viewportRef} className="relative flex-1 h-full overflow-hidden">
        <div
          className="transform origin-top-left"
          style={
            loading
              ? {
                  width: '100%',
                  height: '100%',
                }
              : {
                  transform: `matrix(${boxRect.scale}, 0, 0, ${boxRect.scale}, ${boxRect.x}, ${boxRect.y})`,
                  width: `${boxRect.width}px`,
                  height: `${boxRect.height}px`,
                }
          }
        >
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
    </div>
  );
};
