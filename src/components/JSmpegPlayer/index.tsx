'use client';

import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { useEffect, useRef } from 'react';

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

export default function JSmpegPlayer(props: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    playerRef.current = new JSMpeg.Player(props.src, {
      canvas: canvasRef.current,
      autoplay: props.autoPlay,
      loop: props.loop,
      audio: props.muted,
      poster: props.poster,
    });
  }, []);

  return (
    <div className={props.className}>
      <canvas className="w-full h-full" ref={canvasRef}></canvas>
    </div>
  );
}
