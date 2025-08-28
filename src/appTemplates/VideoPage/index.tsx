import JSmpegPlayer from '@/components/JSmpegPlayer';
import OgvPlayer from '@/components/OgvPlayer';
import VideoPlayer from '@/components/VideoPlayer';
import VideoJsPlayer from '@/components/VideoPlayer/videojs';

export const VideoPage = () => {
  return (
    <div>
      <h1>video测试</h1>
      <div className="w-200">
        <VideoPlayer src="/test-video.mp4" autoPlay />
      </div>
      <h1>jsmpeg/ts</h1>
      <div className="w-200">
        <JSmpegPlayer src="/test-video.ts" autoPlay loop />
      </div>
      <h1>ogv/webm</h1>
      <OgvPlayer className="w-200" src="/test-video.webm" autoPlay />
    </div>
  );
};
