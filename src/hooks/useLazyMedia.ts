import { useEffect, useRef, useState } from 'react';

type MediaType = 'video' | 'image' | 'iframe';

interface UseLazyMediaProps {
  id: string;
  type: MediaType;
  threshold?: number;
  rootMargin?: string;
}

export const useLazyMedia = ({
  id,
  type,
  threshold = 0.1,
  rootMargin = '50px',
}: UseLazyMediaProps) => {
  const mediaRef = useRef<
    HTMLVideoElement | HTMLImageElement | HTMLIFrameElement
  >(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observerId = `media-observer-${id}-${type}`;
    let observer: IntersectionObserver;

    try {
      observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setShouldLoad(true);
              setIsInView(true);

              // Only disconnect for images since videos/iframes might need
              // to track visibility for autoplay/pause
              if (type === 'image') {
                obs.disconnect();
              } else {
                setIsInView(entry.isIntersecting);
              }
            } else {
              setIsInView(false);
            }
          });
        },
        {
          threshold,
          rootMargin,
        }
      );

      if (mediaRef.current) {
        observer.observe(mediaRef.current);
      }
    } catch (error) {
      // Fallback for browsers that don't support IntersectionObserver
      setShouldLoad(true);
      setIsInView(true);
      console.warn(`IntersectionObserver failed for ${observerId}:`, error);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [id, type, threshold, rootMargin]);

  return { mediaRef, shouldLoad, isInView };
};
