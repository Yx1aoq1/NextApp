import * as MP4Box from 'mp4box'
import { MultiBufferStream } from 'mp4box'

interface Mp4PlayerOptions {
  canvas: HTMLCanvasElement
  src: string
  autoplay?: boolean
  loop?: boolean
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  onProgress?: (currentTime: number, duration: number) => void
}

export type Frame = {
  img: ImageBitmap
  duration: number | null
  timestamp: number
}

export class Mp4Player {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private mp4box: MP4Box.ISOFile
  private src: string
  private loop: boolean = false
  private autoplay: boolean = false

  private videoTrack: MP4Box.Track | null = null
  private videoDecoder: VideoDecoder | null = null

  private paused: boolean = true
  private isPlaying: boolean = false
  private animationId: number | null = null
  private seekTimer: NodeJS.Timeout | null = null

  private videoFrames: Frame[] = []
  private currentFrameIndex: number = 0
  private startTime: number = 0
  private currentTime: number = 0

  private onPlayCallback?: () => void
  private onPauseCallback?: () => void
  private onEndedCallback?: () => void
  private onProgressCallback?: (currentTime: number, duration: number) => void

  constructor(options: Mp4PlayerOptions) {
    this.canvas = options.canvas
    this.ctx = this.canvas.getContext('2d')!
    this.src = options.src
    this.autoplay = options.autoplay ?? false
    this.loop = options.loop ?? false
    this.mp4box = MP4Box.createFile()

    this.onPlayCallback = options.onPlay
    this.onPauseCallback = options.onPause
    this.onEndedCallback = options.onEnded
    this.onProgressCallback = options.onProgress

    this.initMp4Box()
    this.loadVideo()
  }

  private initMp4Box() {
    const getExtraData = () => {
      // 生成VideoDecoder.configure需要的description信息
      const entry = this.mp4box.moov.traks[0].mdia.minf.stbl.stsd
        .entries[0] as MP4Box.VisualSampleEntry
      const box = entry.avcC ?? entry.hvcC ?? entry.vpcC

      if (box != null) {
        const stream = new MultiBufferStream()
        box.write(stream)
        return new Uint8Array(stream.buffer.slice(8))
      }
    }

    this.mp4box.onReady = info => {
      // 获取视频轨道信息
      this.videoTrack = info.videoTracks[0]
      if (this.videoTrack) {
        this.mp4box.setExtractionOptions(this.videoTrack.id, 'video', {
          nbSamples: 100,
        })
      } else {
        console.warn('No video track found.')
        return
      }
      // 视频的宽度和高度
      const videoW = this.videoTrack?.track_width ?? 0
      const videoH = this.videoTrack?.track_height ?? 0
      // 设置canvas的宽高
      this.canvas.width = videoW
      this.canvas.height = videoH

      this.videoDecoder = new VideoDecoder({
        output: (videoFrame: VideoFrame) => {
          createImageBitmap(videoFrame).then(img => {
            this.videoFrames.push({
              img,
              duration: videoFrame.duration,
              timestamp: videoFrame.timestamp,
            })
            videoFrame.close()
          })
        },
        error: e => console.error('decoder error:', e),
      })

      const description = getExtraData()

      this.videoDecoder.configure({
        codec: this.videoTrack.codec,
        codedWidth: videoW,
        codedHeight: videoH,
        description,
      })

      this.mp4box.start()

      if (this.autoplay) {
        this.play()
      }
    }

    this.mp4box.onSamples = (trackId, ref, samples) => {
      if (this.videoTrack?.id === trackId) {
        for (const sample of samples) {
          const chunk = new EncodedVideoChunk({
            type: sample.is_sync ? 'key' : 'delta',
            timestamp: sample.cts,
            duration: sample.duration,
            data: sample.data!,
          })

          this.videoDecoder?.decode(chunk)
        }
      }
    }
  }

  private async loadVideo() {
    try {
      const response = await fetch(this.src)
      const buffer = (await response.arrayBuffer()) as MP4Box.MP4BoxBuffer
      buffer.fileStart = 0
      this.mp4box.appendBuffer(buffer)
      this.mp4box.flush()
      // const reader = response.body?.getReader()
      // if (!reader) {
      //   throw new Error('Failed to get readable stream from video URL.')
      // }
      // let offset = 0
      // while (true) {
      //   const { done, value } = await reader.read()
      //   console.log('🚀 ~ Mp4Player ~ loadVideo ~ done:', done)
      //   if (done) {
      //     this.mp4box.flush()
      //     break
      //   }
      //   const buffer = value.buffer as MP4Box.MP4BoxBuffer
      //   buffer.fileStart = offset
      //   this.mp4box.appendBuffer(buffer)
      //   offset += buffer.byteLength

      //   console.log(
      //     `已读取 ${offset} 字节，当前的 box 列表:`,
      //     this.mp4box.boxes.map(b => b.type)
      //   )
      // }
    } catch (error) {
      console.error('fetch error:', error)
    }
  }

  private findFrame(timestamp: number, startIndex = 0) {
    // 查找当前应该显示的帧
    let targetFrame: Frame | null = null
    let targetIndex = startIndex

    // 从当前帧开始向前查找
    for (let i = startIndex; i < this.videoFrames.length; i++) {
      const frame = this.videoFrames[i]
      if (frame.timestamp <= timestamp) {
        targetFrame = frame
        targetIndex = i
      } else {
        break
      }
    }

    if (targetFrame && targetIndex >= startIndex) {
      return {
        frame: targetFrame,
        index: targetIndex,
      }
    }

    return {
      frame: null,
      index: -1,
    }
  }

  private update = (now: DOMHighResTimeStamp) => {
    this.animationId = requestAnimationFrame(this.update)

    // 如果没有帧数据，直接返回
    if (this.videoFrames.length === 0 || !this.videoTrack) return

    // 初始化播放开始时间
    if (!this.isPlaying) {
      this.startTime = now - this.currentTime * 1000
      this.isPlaying = true
      this.onPlayCallback?.()
    }

    // 计算当前应该播放的时间
    const elapsedTime = now - this.startTime
    // 使用视频轨道的timescale来正确转换时间
    const currentTimestamp = (elapsedTime / 1000) * this.videoTrack.timescale
    // 查找当前应该显示的帧
    const { frame: targetFrame, index: targetIndex } = this.findFrame(
      currentTimestamp,
      this.currentFrameIndex
    )

    // 如果找到了新的帧，渲染它
    if (targetFrame && targetIndex >= this.currentFrameIndex) {
      this.ctx.drawImage(targetFrame.img, 0, 0, this.canvas.width, this.canvas.height)
      this.currentFrameIndex = targetIndex
      this.currentTime = targetFrame.timestamp / this.videoTrack.timescale

      // 调用进度回调
      if (this.onProgressCallback) {
        const duration = this.getDuration()
        this.onProgressCallback(this.currentTime, duration)
      }
    }

    // 检查是否播放结束
    if (this.currentFrameIndex >= this.videoFrames.length - 1) {
      // 检查是否还有更多帧在解析中
      const lastFrameTime = this.videoFrames[this.videoFrames.length - 1]?.timestamp || 0
      const videoDuration = this.videoTrack.duration

      // 如果最后一帧的时间戳接近视频总时长，说明播放结束
      if (lastFrameTime >= videoDuration * 0.95) {
        if (this.loop) {
          // 循环播放：重置到开头
          this.currentFrameIndex = 0
          this.currentTime = 0
          this.startTime = now
          this.isPlaying = true
        } else {
          // 正常结束播放
          this.isPlaying = false
          this.paused = true
          this.onEndedCallback?.()
          cancelAnimationFrame(this.animationId)
          return
        }
      }
    }

    // 如果当前时间超过了最后一帧但视频还在解析，等待更多帧
    if (
      this.currentFrameIndex >= this.videoFrames.length - 1 &&
      currentTimestamp > (this.videoFrames[this.videoFrames.length - 1]?.timestamp || 0)
    ) {
      // 暂时不更新currentFrameIndex，等待新帧到达
      return
    }
  }

  play() {
    if (this.animationId) return

    this.animationId = requestAnimationFrame(this.update)
    this.paused = false
  }

  pause() {
    if (this.paused || !this.animationId) {
      return
    }

    cancelAnimationFrame(this.animationId)
    this.animationId = null
    this.isPlaying = false
    this.paused = true
    this.onPauseCallback?.()
  }

  stop() {
    this.pause()
    this.seek(0)
  }

  // 跳转到指定时间
  seek(time: number) {
    if (!this.videoTrack) return

    if (this.seekTimer) {
      clearTimeout(this.seekTimer)
    }

    // 限制时间范围
    const duration = this.getDuration()
    this.currentTime = Math.max(0, Math.min(time, duration))

    // 转换为视频时间戳
    const targetTimestamp = this.currentTime * this.videoTrack.timescale
    // 查找当前应该显示的帧
    const { frame: targetFrame, index: targetIndex } = this.findFrame(targetTimestamp)
    // 存在帧数据时，渲染帧
    if (targetFrame) {
      this.ctx.drawImage(targetFrame.img, 0, 0, this.canvas.width, this.canvas.height)
      this.currentFrameIndex = targetIndex
    } else {
      // 可能帧还未解析出来，所以延迟100ms再试一次
      this.seekTimer = setTimeout(() => {
        this.seek(time)
      }, 100)
    }
    // 如果正在播放，调整开始时间以保持同步
    if (this.isPlaying) {
      this.startTime = performance.now() - this.currentTime * 1000
    }
  }

  // 获取视频总时长（秒）
  getDuration(): number {
    if (!this.videoTrack) return 0
    return this.videoTrack.duration / this.videoTrack.timescale
  }
}
