'use client'

import { useState } from 'react'

import CanvasPlayer from '@/components/CanvasPlayer'
import JSmpegPlayer from '@/components/JSmpegPlayer'
import MP4Player from '@/components/MP4Player'
import OgvPlayer from '@/components/OgvPlayer'
import VideoPlayer from '@/components/VideoPlayer'

export const VideoPage = () => {
  const [percent, setPercent] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX } = e
    const { left, width } = e.currentTarget.getBoundingClientRect()
    const x = clientX - left
    const percent = (x / width) * 100
    setPercent(percent)
  }

  return (
    <div>
      <h1>video测试(左为video，右为JSMpeg)</h1>
      <div
        className="relative w-200"
        style={{ '--percent': `${percent}%` } as React.CSSProperties}
        onMouseMove={handleMouseMove}
      >
        <div className="relative inset-y-0 left-0 h-full w-full">
          <VideoPlayer src="/test-video.mp4" autoPlay />
        </div>
        <div
          className="absolute inset-y-0 left-0 z-2 h-full w-full"
          style={{
            clipPath: 'polygon(var(--percent, 0) 0, 100% 0, 100% 100%, var(--percent, 0) 100%)',
          }}
        >
          <JSmpegPlayer src="/test-video.tsv" autoPlay />
        </div>
        <div
          className="absolute inset-y-0 z-3 h-full w-0.5 bg-red-500"
          style={{ left: 'var(--percent, 0)' }}
        ></div>
      </div>
      <h1>mp4box.js+canvas</h1>
      <div className="w-200">
        <MP4Player src="/Game_batch_batch.mp4" autoPlay />
      </div>
      <h1>video+canvas</h1>
      <div className="w-200">
        <CanvasPlayer src="/Game_batch_batch.mp4" autoPlay />
      </div>
      <h1>ogv/webm</h1>
      <OgvPlayer className="w-200" src="/test-video.webm" autoPlay />
    </div>
  )
}
