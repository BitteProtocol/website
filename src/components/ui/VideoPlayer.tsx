import React from 'react';
import ReactPlayer from 'react-player/lazy';
import { Button } from '../ui/button';
import { Play } from 'lucide-react';

const VideoPlayer = ({ url }: { url: string }) => {
  return (
    <div className='relative w-full h-full'>
      <ReactPlayer
        url={url}
        muted
        controls
        width='100%'
        height='100%'
        light={true}
        playIcon={
          <Button className='rounded-full bg-[#414D7D33] backdrop-blur-md w-16 h-16 flex items-center justify-center z-[99]'>
            <Play size={24} color='white' />
          </Button>
        }
      />
    </div>
  );
};

export default VideoPlayer;
