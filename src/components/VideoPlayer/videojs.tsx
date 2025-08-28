'use client';

import type { Ref } from 'react';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

import cn from 'clsx';
import Image from 'next/image';

import useDocumentVisibilityChange from '@/hooks/useDocumentVisibilityChange';
import { useInViewport } from '@/hooks/useInViewport';

import styles from './index.module.scss';

import type { StaticImageData } from 'next/image';
import videojs from 'video.js';

interface Props {
  /** 视频地址 */
  src: string;

  /** 视频封面图 */
  poster?: StaticImageData | string;

  /** 封面图 blur 样式  */
  posterBlur?: boolean;

  /** 是否静音 */
  muted?: boolean;

  /** 是否自动播放 */
  autoPlay?: boolean;

  /** 显示控制栏 */
  controls?: boolean;

  /** class */
  className?: string;

  /** 滑动到视口内时重头播放 */
  replay?: boolean;

  /** 是否循环播放 */
  loop?: boolean;

  /** 封面图是否优先加载 */
  priority?: boolean;

  /** 播放结束后触发 */
  onEnded?: () => void;
}

export interface VideoPlayerRef {
  /** 播放 */
  play: () => void;

  /** 暂停 */
  stop: () => void;
}

const VideoPlayer = forwardRef<VideoPlayerRef, Props>((props, ref) => {
  const {
    loop = true,
    muted = true,
    autoPlay = false,
    controls = false,
    posterBlur = false,
    replay = true,
    priority = false,
  } = props;
  const videoRef: Ref<HTMLVideoElement> = useRef(null);
  const containerRef: Ref<HTMLDivElement> = useRef(null);
  const playerRef = useRef<any>(null);
  const poster =
    !props.poster || typeof props.poster === 'string' ? props.poster : (props.poster as StaticImageData).src;
  const src = typeof props.src === 'string' ? props.src : (props.src as any).src;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayEnd, setIsPlayEnd] = useState(false);
  const inViewport = useInViewport(videoRef as React.RefObject<HTMLElement>, {
    root: null,
    rootMargin: '0px',
    threshold: 0,
  });

  const isPosterVisible = poster && !isPlaying && !isPlayEnd;

  const play = () => {};

  const pause = () => {};

  const stop = () => {};

  const onPlay = () => {
    setIsPlaying(true);
  };

  const onPause = () => {
    setIsPlaying(false);
  };

  const onEnded = () => {
    setIsPlayEnd(true);
  };

  useEffect(() => {
    if (!replay || !autoPlay) return;

    if (inViewport && !isPlaying) {
      play();
    }
    if (!inViewport && isPlaying) {
      stop();
    }
  }, [inViewport, isPlaying, replay, autoPlay]);

  useEffect(() => {
    playerRef.current = videojs(videoRef.current as Element, {
      controls,
      autoplay: autoPlay,
      muted,
      loop,
      preload: 'auto',
    });

    return () => {
      playerRef.current?.dispose();
    };
  }, [src]);

  useImperativeHandle(ref, () => ({
    play,
    stop,
  }));

  useDocumentVisibilityChange((isVisible: boolean) => {
    if (isVisible) {
      play();
    }
  });

  return (
    <div className={cn([styles['video-container'], props.className])} ref={containerRef}>
      <div data-vjs-player>
        <video ref={videoRef} className="video-js" />
      </div>
      {isPosterVisible && (
        <div className={cn(styles['video-poster-outer'], { [styles['video-poster-blur']]: posterBlur })}>
          {poster && (
            <Image
              src={poster}
              alt=""
              fill
              sizes="100vw,100vh"
              className={cn(styles['video-poster'], 'video-poster')}
              style={{ objectFit: 'cover' }}
              onClick={play}
              priority={priority}
            />
          )}
        </div>
      )}
    </div>
  );
});

export default VideoPlayer;
