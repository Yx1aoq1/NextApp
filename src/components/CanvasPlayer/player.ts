interface CanvasPlayerOptions {
  canvas: HTMLCanvasElement
  src: string
  autoplay?: boolean
  loop?: boolean
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
}

export class CavPlayer {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private video: HTMLVideoElement | null = null
  private src: string
  private autoplay: boolean
  private loop: boolean

  private animationId: number | null = null

  private onPlayCallback?: () => void
  private onPauseCallback?: () => void
  private onEndedCallback?: () => void

  constructor(options: CanvasPlayerOptions) {
    this.src = options.src
    this.autoplay = options.autoplay ?? false
    this.loop = options.loop ?? false
    this.canvas = options.canvas
    this.ctx = this.canvas.getContext('2d')!

    this.onPlayCallback = options.onPlay
    this.onPauseCallback = options.onPause
    this.onEndedCallback = options.onEnded

    this.loadVideo()
  }

  private loadVideo() {
    this.video = document.createElement('video')
    this.video.muted = true
    this.video.src = this.src
    this.video.loop = this.loop ?? false
    this.video.autoplay = this.autoplay ?? false

    this.video.addEventListener('loadeddata', () => {
      this.canvas.width = this.video?.videoWidth ?? 0
      this.canvas.height = this.video?.videoHeight ?? 0
    })

    this.video.addEventListener('play', () => {
      this.onPlayCallback?.()
      this.startAnimation()
    })

    this.video.addEventListener('pause', () => {
      this.onPauseCallback?.()
      this.stopAnimation()
    })

    this.video.addEventListener('ended', () => {
      this.onEndedCallback?.()
    })
  }

  private computeFrame = () => {
    if (!this.video || this.video.paused || this.video.ended) {
      return
    }
    this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height)
    this.animationId = requestAnimationFrame(this.computeFrame)
  }

  private startAnimation() {
    if (this.animationId) {
      return
    }
    this.animationId = requestAnimationFrame(this.computeFrame)
  }

  private stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }

  play() {
    this.video?.play()
  }

  pause() {
    this.video?.pause()
  }

  stop() {
    if (this.video && this.video.paused === false) {
      this.video.currentTime = 0
      this.video.pause()
    }
  }
}
