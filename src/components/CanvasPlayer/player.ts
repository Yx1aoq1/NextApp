import Konva from 'konva'

interface KonvaPlayerOptions {
  container: string
  src: string
  autoplay?: boolean
  loop?: boolean
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  onProgress?: (currentTime: number, duration: number) => void
}

export class KonvaPlayer {
  private video: HTMLVideoElement | null = null
  private src: string
  private container: string
  private containerElm: HTMLElement | null = null
  private stage: Konva.Stage | null = null
  private layer: Konva.Layer | null = null
  private image: Konva.Image | null = null
  private anim: Konva.Animation | null = null

  constructor(options: KonvaPlayerOptions) {
    this.src = options.src
    this.container = options.container
    this.containerElm = document.getElementById(this.container)

    this.loadVideo(options)
    this.loadCanvas()
  }

  private loadVideo(options: KonvaPlayerOptions) {
    this.video = document.createElement('video')
    this.video.muted = true
    this.video.src = options.src
    this.video.loop = options.loop ?? false
    this.video.autoplay = options.autoplay ?? false

    this.video.addEventListener('loadeddata', () => {
      const width = this.containerElm?.clientWidth ?? 0

      const scale = width / (this.video?.videoWidth ?? width)

      const height = (this.video?.videoHeight ?? 0) * scale

      this.stage?.width(width)
      this.stage?.height(height)
      this.image?.width(width)
      this.image?.height(height)
    })

    this.video.addEventListener('play', () => {
      options.onPlay && options.onPlay()
      this.anim?.start() // 视频播放时启动动画
    })

    this.video.addEventListener('pause', () => {
      options.onPause && options.onPause()
      this.anim?.stop() // 视频暂停时停止动画
    })

    this.video.addEventListener('ended', () => {
      options.onEnded && options.onEnded()
      this.anim?.stop() // 视频结束时停止动画
    })
  }

  private loadCanvas() {
    this.stage = new Konva.Stage({
      container: this.container,
    })

    this.layer = new Konva.Layer()
    this.stage.add(this.layer)

    this.image = new Konva.Image({
      image: this.video!,
      draggable: true,
      x: 0,
      y: 0,
    })

    this.layer.add(this.image)

    this.anim = new Konva.Animation(function () {
      // do nothing, animation just needs to update the layer
    }, this.layer)
  }

  play() {
    this.video?.play()
  }

  pause() {
    this.video?.pause()
  }

  stop() {
    this.video?.pause()
    this.video && (this.video.currentTime = 0)
  }
}
