import React from 'react';
import ReactPlayer from 'react-player/lazy';
import { Button } from '../ui/button';
import { Play } from 'lucide-react';

const VideoPlayer = ({
  url,
  thumbnail,
  onPlay,
}: {
  url: string;
  thumbnail: string | undefined;
  onPlay: () => void;
}) => {
  return (
    <div className='relative w-full h-full'>
      <ReactPlayer
        url={url}
        muted
        playing
        controls
        width='100%'
        height='100%'
        light={thumbnail}
        playIcon={
          <Button className='rounded-full bg-mb-indigo-20 backdrop-blur-md w-16 h-16 flex items-center justify-center z-[99]'>
            <Play size={24} color='white' />
          </Button>
        }
        onPlay={onPlay}
      />
    </div>
  );
};

export default VideoPlayer;
