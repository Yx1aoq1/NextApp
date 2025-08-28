'use client';

import type { Ref } from 'react';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

import cn from 'clsx';
import Image from 'next/image';

import useDocumentVisibilityChange from '@/hooks/useDocumentVisibilityChange';
import { useInViewport } from '@/hooks/useInViewport';

import styles from './index.module.scss';

import type { StaticImageData } from 'next/image';

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

  /** 将视频url转为blob防止劫持 */
  useBlob?: boolean;

  /** 播放结束后触发 */
  onEnded?: () => void;
}

export interface VideoPlayerRef {
  /** 播放 */
  play: () => void;

  /** 暂停 */
  stop: () => void;
}

/** 对于某些国内浏览器转为blob播放有助于防劫持 */
const videoToBlob = (src: string) => {
  return new Promise<string>(resolve => {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', src, true);

    xhr.responseType = 'blob';

    xhr.onload = (e: any) => {
      if (e.target.status == 200) {
        resolve(URL.createObjectURL(e.target.response));
      }
    };
    xhr.send();
  });
};

const VideoPlayer = forwardRef<VideoPlayerRef, Props>((props, ref) => {
  const {
    loop = true,
    muted = true,
    autoPlay = false,
    controls = false,
    posterBlur = false,
    replay = true,
    priority = false,
    useBlob = false,
  } = props;
  const videoRef: Ref<HTMLVideoElement> = useRef(null);
  const containerRef: Ref<HTMLDivElement> = useRef(null);
  const poster =
    !props.poster || typeof props.poster === 'string' ? props.poster : (props.poster as StaticImageData).src;
  const src = typeof props.src === 'string' ? props.src : (props.src as any).src;

  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [supportBlob, setSupportBlob] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayEnd, setIsPlayEnd] = useState(false);
  const inViewport = useInViewport(videoRef as React.RefObject<HTMLElement>, {
    root: null,
    rootMargin: '0px',
    threshold: 0,
  });

  const isPosterVisible = poster && !isPlaying && !isPlayEnd;
  const videoSrc = useBlob && supportBlob ? blobUrl : src;
  const timer = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const play = useCallback(() => {
    const video = videoRef?.current;
    clearTimer();
    try {
      video
        ?.play()
        .then(() => {
          const lastTime = video.currentTime;
          // safari有时候执行了但是没有在播，所以重新检测下播放进度是否有更新
          timer.current = setTimeout(() => {
            if (video.currentTime !== lastTime) {
              setIsPlaying(true);
              setIsPlayEnd(false);
            } else {
              play();
            }
          }, 500);
        })
        .catch(e => {
          console.log(e);
        });
    } catch (error) {
      console.log(error);
    }
  }, [videoRef]);

  const pause = useCallback(() => {
    const video = videoRef?.current;
    try {
      video?.pause();
      setIsPlaying(false);
    } catch (error) {
      console.log(error);
    }
  }, [videoRef]);

  const stop = useCallback(() => {
    const video = videoRef?.current;
    if (!video) return;
    pause();
    video.currentTime = 0;
  }, [videoRef, pause]);

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
  }, [inViewport, isPlaying, replay, autoPlay, play, stop]);

  useImperativeHandle(ref, () => ({
    play,
    stop,
  }));
  // 将url转为blob播放，防止劫持
  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;
    const initBlobUrl = async (src: string) => {
      const blobUrl = await videoToBlob(src);
      setBlobUrl(blobUrl);
    };

    const handleNotSupportBlob = () => {
      if (blobUrl) {
        setSupportBlob(false);
      }
    };

    if (useBlob && src && !blobUrl) {
      initBlobUrl(src);
    }
    // 防止浏览器不支持blob播放，可以回退成src播放
    video?.addEventListener('error', handleNotSupportBlob);

    return () => {
      video?.removeEventListener('error', handleNotSupportBlob);
    };
  }, [useBlob, src, blobUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // 在ios 13中频繁切换发现会导致崩溃，所以在切换前需要清除上一个视频
    video.pause();
    video.removeAttribute('src');
    video.removeAttribute('poster');
    video.load();
    setIsPlaying(false);

    if (videoSrc) {
      video.src = videoSrc;
      video.poster = poster || '';
    }
    if (autoPlay) {
      play();
    }
  }, [videoSrc, poster, autoPlay, play]);

  useDocumentVisibilityChange((isVisible: boolean) => {
    if (isVisible) {
      play();
    }
  });

  return (
    <div className={cn([styles['video-container'], props.className])} ref={containerRef}>
      <video
        preload="auto"
        ref={videoRef}
        className={cn('video-content', styles['video-content'])}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        controls={controls}
        muted={muted}
        disableRemotePlayback
        disablePictureInPicture
        playsInline
        x5-playsinline="true"
        webkit-playsinline="true"
        x-webkit-airplay="true"
        t7-video-player-type="inline"
        x5-video-player-type="h5"
        x5-video-player-fullscreen="false"
        x5-video-orientation="portraint"
        onClick={play}
        onPlaying={onPlay}
        onEnded={onEnded}
        onPaste={onPause}
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

export default VideoPlayer;
