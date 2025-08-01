declare class OGVPlayer extends HTMLElement {
  src: string;
  autoplay: boolean;
  preload: string;
  volume: number;
  paused: boolean;
  videoWidth: number;
  videoHeight: number;
  play(): void;
  pause(): void;
  stop(): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
}

declare const OGVLoader: {
  base: string;
};

declare const OGV: {
  enableWebM: boolean;
  enableVP9: boolean;
};

declare class JSMpeg {
  static Player: any;
}
