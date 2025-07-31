'use client';

import { useEffect, useRef } from 'react';
import cn from 'clsx';
import styles from './index.module.scss';

export interface Props {
  src: string;
  className?: string;
}

const OgvPlayer = (props: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const player = new OGVPlayer();

    player.src = props.src;
    player.autoplay = true;
    player.loop = true;
    player.style.width = '100%';

    containerRef.current?.appendChild(player);
    player.play();

    player.addEventListener('ended', () => {
      // 视频播放结束，重新播放
      player.currentTime = 0;
      player.play();
    });
  }, []);

  return <div ref={containerRef} className={cn(styles.container, props.className)}></div>;
};

export default OgvPlayer;
