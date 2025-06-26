import HomeVideoCover from '@/assets/home-video-cover.jpg';
import VideoContainer from '@/components/VideoContainer';

export const VideoPage = () => {
  return (
    <div>
      <h1>video测试</h1>
      <div>
        <VideoContainer className="w-200" src="/home-video.mp4" poster={HomeVideoCover} autoPlay />
      </div>
    </div>
  );
};
