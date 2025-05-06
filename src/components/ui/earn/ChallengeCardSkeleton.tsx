import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function ChallengeCardSkeleton() {
  return (
    <div className='bg-zinc-900 rounded-md overflow-hidden w-full h-[215px]'>
      <div className='p-6 flex flex-col h-full'>
        {/* Title and checkbox skeleton */}
        <div className='flex items-start gap-3 mb-4'>
          <Skeleton className='w-5 h-5 rounded-full flex-shrink-0' />
          <Skeleton className='w-3/4 h-5' />
        </div>

        {/* Divider */}
        <div className='border-b border-zinc-800 -mx-6 mb-5'></div>

        {/* Reward row skeleton */}
        <div className='flex justify-between items-center mb-4'>
          <Skeleton className='w-16 h-4' />
          <Skeleton className='w-24 h-5' />
        </div>

        {/* Frequency row skeleton */}
        <div className='flex justify-between items-center mb-4'>
          <Skeleton className='w-20 h-4' />
          <Skeleton className='w-16 h-5' />
        </div>

        {/* CTA row skeleton */}
        <div className='flex justify-between items-center mt-auto'>
          <Skeleton className='w-10 h-4' />
          <Skeleton className='w-20 h-8 rounded-md' />
        </div>
      </div>
    </div>
  );
}
