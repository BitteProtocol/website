import Image, { ImageProps } from 'next/image';
import React, { useState } from 'react';

const AgentImage: React.FC<ImageProps> = ({ src, alt, ...props }) => {
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleError = () => {
    setCurrentSrc('/logo.svg');
  };

  return <Image {...props} src={currentSrc} alt={alt} onError={handleError} />;
};

export default AgentImage;
