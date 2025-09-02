'use client'

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'

import cn from 'clsx'
import Image from 'next/image'

import useDocumentVisibilityChange from '@/hooks/useDocumentVisibilityChange'
import { useInViewport } from '@/hooks/useInViewport'

import { Mp4Player } from './player'

import styles from './index.module.scss'

import type { StaticImageData } from 'next/image'

export interface CanvasPlayerRef {
  /** 播放 */
  play: () => void

  /** 暂停 */
  stop: () => void
}

interface Props {
  /** 视频地址 */
  src: string

  /** 视频封面图 */
  poster?: StaticImageData | string

  /** 封面图 blur 样式  */
  posterBlur?: boolean

  /** 是否自动播放 */
  autoPlay?: boolean

  /** class */
  className?: string

  /** 滑动到视口内时重头播放 */
  replay?: boolean

  /** 是否循环播放 */
  loop?: boolean

  /** 封面图是否优先加载 */
  priority?: boolean
}

const CanvasPlayer = forwardRef<CanvasPlayerRef, Props>((props, ref) => {
  const {
    loop = true,
    autoPlay = false,
    posterBlur = false,
    replay = true,
    priority = false,
  } = props
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const playerRef = useRef<Mp4Player | null>(null)

  const poster =
    !props.poster || typeof props.poster === 'string'
      ? props.poster
      : (props.poster as StaticImageData).src
  const src = typeof props.src === 'string' ? props.src : (props.src as any).src

  const [isPlaying, setIsPlaying] = useState(false)
  const [isPlayEnd, setIsPlayEnd] = useState(false)
  const inViewport = useInViewport(canvasRef as React.RefObject<HTMLElement>, {
    root: null,
    rootMargin: '200px',
    threshold: 0,
  })

  const isPosterVisible = poster && !isPlaying && !isPlayEnd

  const play = useCallback(() => {
    playerRef.current?.play()
  }, [])

  const pause = useCallback(() => {
    playerRef.current?.pause()
  }, [])

  const stop = useCallback(() => {
    playerRef.current?.stop()
  }, [])

  useEffect(() => {
    if (!canvasRef.current) return
    playerRef.current = new Mp4Player({
      canvas: canvasRef.current,
      src,
      autoplay: autoPlay,
      loop,
      onPlay: () => {
        setIsPlaying(true)
        setIsPlayEnd(false)
      },
      onPause: () => {
        setIsPlaying(false)
      },
      onEnded: () => {
        setIsPlayEnd(true)
      },
    })
  }, [src, autoPlay, loop])

  useDocumentVisibilityChange((isVisible: boolean) => {
    if (isVisible && inViewport) {
      play()
    }
  })

  useEffect(() => {
    if (!replay || !autoPlay) return

    if (inViewport && !isPlaying) {
      play()
    }
    if (!inViewport && isPlaying) {
      stop()
    }
  }, [inViewport, isPlaying, replay, autoPlay, play, stop])

  useImperativeHandle(ref, () => ({
    play,
    stop,
  }))

  return (
    <div className={cn([styles['video-container'], props.className])}>
      <canvas
        className={cn('video-content', styles['video-content'], {
          [styles['video-ready']]: !isPosterVisible,
        })}
        ref={canvasRef}
      />
      {isPosterVisible && (
        <div
          className={cn(styles['video-poster-outer'], {
            [styles['video-poster-blur']]: posterBlur,
          })}
        >
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
  )
})

export default CanvasPlayer
