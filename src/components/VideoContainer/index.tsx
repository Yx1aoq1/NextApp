'use client';

import { StaticImageData, StaticImport } from 'next/dist/shared/lib/get-img-props';
import { Ref, useRef, useState } from 'react';

interface Props {
  /** 视频地址 */
  src: string;

  /** 视频封面图 */
  poster?: StaticImport;

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

  /** 播放结束后触发 */
  onEnded?: () => void;
}

const VideoContainer = (props: Props) => {
  const { loop = true, muted = true, autoPlay = false, controls = false, replay = true } = props;
  const videoRef: Ref<HTMLVideoElement> = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayEnd, setIsPlayEnd] = useState(false);
  const poster = props.poster && 'default' in props.poster ? (props.poster.default as StaticImageData) : props.poster;

  const play = async () => {
    const video = videoRef?.current;
    try {
      await video?.play().catch(() => void 0);
      setIsPlaying(true);
      setIsPlayEnd(false);
    } catch (error) {
      console.log(error);
    }
  };

  const pause = () => {
    const video = videoRef?.current;
    try {
      video?.pause();
      setIsPlaying(false);
    } catch (error) {
      console.log(error);
    }
  };

  const stop = () => {
    const video = videoRef?.current;
    if (!video) return;
    pause();
    video.currentTime = 0;
  };

  const onPlay = () => {
    setIsPlaying(true);
  };

  const onPause = () => {
    setIsPlaying(false);
  };

  const onEnded = () => {
    setIsPlayEnd(true);
  };

  return (
    <div className={props.className}>
      <video
        preload="auto"
        ref={videoRef}
        src={props.src}
        className="w-full h-full"
        autoPlay={autoPlay}
        loop={loop}
        controls={controls}
        poster={poster?.src}
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
    </div>
  );
};

export default VideoContainer;
