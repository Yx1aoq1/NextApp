import JSmpegPlayer from '@/components/JSmpegPlayer';
import OgvPlayer from '@/components/OgvPlayer';
import VideoContainer from '@/components/VideoContainer';

export const VideoPage = () => {
  return (
    <div>
      <h1>video测试</h1>
      <VideoContainer className="w-200" src="/test-video.mp4" autoPlay />
      <h1>ogv/webm</h1>
      <OgvPlayer className="w-200" src="/test-video.webm" autoPlay />
      <h1>jsmpeg/ts</h1>
      <JSmpegPlayer className="w-200" src="/test-video.ts" autoPlay loop />
    </div>
  );
};
