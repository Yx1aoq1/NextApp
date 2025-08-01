'use client';

import { useEffect, useRef } from 'react';
import cn from 'clsx';
import styles from './index.module.scss';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

export interface Props {
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

const OgvPlayer = (props: Props) => {
  const { src, autoPlay = false, loop = true, muted = true, controls = false, replay = true } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<OGVPlayer>(null);

  useEffect(() => {
    playerRef.current = new OGVPlayer();

    playerRef.current.src = src;
    playerRef.current.autoplay = autoPlay;
    playerRef.current.style.width = '100%';

    containerRef.current?.appendChild(playerRef.current);

    if (autoPlay) {
      playerRef.current.play();
    }

    const onEnded = () => {
      if (loop) {
        playerRef.current?.play();
      }
    };

    playerRef.current.addEventListener('ended', onEnded);

    return () => {
      playerRef.current?.removeEventListener('ended', onEnded);
    };
  }, []);

  return <div ref={containerRef} className={cn(styles.container, props.className)}></div>;
};

export default OgvPlayer;
