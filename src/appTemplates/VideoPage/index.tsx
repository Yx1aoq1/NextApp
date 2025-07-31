import OgvPlayer from '@/components/OgvPlayer';
import VideoContainer from '@/components/VideoContainer';

export const VideoPage = () => {
  return (
    <div>
      <h1>video测试</h1>
      <VideoContainer className="w-200" src="/test-video.mp4" autoPlay />
      <OgvPlayer className="w-200" src="/test-video.webm" />
    </div>
  );
};
