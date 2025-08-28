'use client';

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

import cn from 'clsx';
import Image from 'next/image';

import { useInViewport } from '@/hooks/useInViewport';

import { useJSMpegReady } from './useJSMpegReady';

import styles from './index.module.scss';

import type { StaticImageData } from 'next/image';

export interface JSmpegPlayerRef {
  /** 播放 */
  play: () => void;

  /** 暂停 */
  stop: () => void;
}

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

  /** class */
  className?: string;

  /** 滑动到视口内时重头播放 */
  replay?: boolean;

  /** 是否循环播放 */
  loop?: boolean;

  /** 封面图是否优先加载 */
  priority?: boolean;
}

const JSmpegPlayer = forwardRef<JSmpegPlayerRef, Props>((props, ref) => {
  const { loop = true, muted = true, autoPlay = false, posterBlur = false, replay = true, priority = false } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<any>(null);

  const poster =
    !props.poster || typeof props.poster === 'string' ? props.poster : (props.poster as StaticImageData).src;
  const src = typeof props.src === 'string' ? props.src : (props.src as any).src;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayEnd, setIsPlayEnd] = useState(false);
  const inViewport = useInViewport(canvasRef as React.RefObject<HTMLElement>, {
    root: null,
    rootMargin: '200px',
    threshold: 0,
  });
  const { isReady: isJSMpegReady, error: jsmpegError } = useJSMpegReady();

  const isPosterVisible = poster && !isPlaying && !isPlayEnd;

  const play = useCallback(() => {
    const player = playerRef.current;
    if (player) {
      player.play();
    }
  }, []);

  const stop = useCallback(() => {
    const player = playerRef.current;
    if (player) {
      player.stop();
    }
  }, []);

  useEffect(() => {
    // Only initialize player when JSMpeg script is ready
    if (!isJSMpegReady || !window.JSMpeg) {
      return;
    }

    // Log error if script failed to load
    if (jsmpegError) {
      console.error('JSMpeg script loading error:', jsmpegError);
      return;
    }

    playerRef.current = new window.JSMpeg.Player(src, {
      canvas: canvasRef.current,
      loop,
      autoplay: autoPlay,
      audio: muted,
      disableGl: true,
      onPlay: () => {
        setIsPlaying(true);
        setIsPlayEnd(false);
      },
      onPause: () => {
        setIsPlaying(false);
      },
      onEnded: () => {
        setIsPlayEnd(true);
      },
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
        setIsPlaying(false);
        setIsPlayEnd(false);
      }
    };
  }, [src, poster, loop, autoPlay, muted, isJSMpegReady, jsmpegError]);

  useEffect(() => {
    if (!replay || !autoPlay) return;

    if (inViewport && !isPlaying) {
      play();
    }
    if (!inViewport && isPlaying) {
      stop();
    }
  }, [inViewport, isPlaying, replay, autoPlay, play, stop]);

  useImperativeHandle(ref, () => ({
    play,
    stop,
  }));

  return (
    <div className={cn([styles['video-container'], props.className])}>
      <canvas
        className={cn('video-content', styles['video-content'], { [styles['video-ready']]: !isPosterVisible })}
        ref={canvasRef}
      />
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

export default JSmpegPlayer;
