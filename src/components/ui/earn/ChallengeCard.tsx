import React from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Challenge } from '@/hooks/useEarnChallenges';

interface ChallengeCardProps {
  challenge: Challenge;
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  return (
    <div
      className={`bg-[#242427] rounded-md overflow-hidden w-full min-w-0 ${
        challenge.completed ? 'h-[175px]' : 'h-[215px]'
      } transition-opacity ${challenge.completed ? 'opacity-80' : ''}`}
    >
      <div className='p-6 flex flex-col h-full'>
        {/* Title and checkbox row */}
        <div className='flex items-center gap-3 mb-4'>
          <div className='mt-0.5 flex-shrink-0'>
            {challenge.completed ? (
              <CheckCircle className='text-green-500 w-5 h-5' />
            ) : (
              <div className='w-5 h-5 border border-zinc-600 rounded-full'></div>
            )}
          </div>
          <h3 className='text-sm font-normal leading-tight'>
            {challenge.title}
          </h3>
        </div>

        {/* Divider */}
        <div className='border-b border-zinc-800 -mx-6 mb-5'></div>

        {/* Reward row */}
        <div className='flex justify-between items-center mb-4'>
          <span className='text-zinc-500 text-sm'>Reward</span>
          <div className='flex items-center'>
            <div className='w-5 h-5 bg-white rounded-full mr-2 flex items-center justify-center'>
              <img
                src='/bitte-symbol-black.svg'
                alt='BITTE'
                className='w-3 h-3'
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>';
                  target.className = 'w-3 h-3 text-black';
                }}
              />
            </div>
            <span className='font-medium'>
              {challenge.reward}{' '}
              <span className='text-zinc-500 text-sm ml-1'>$BITTE</span>
            </span>
          </div>
        </div>

        {/* Frequency row */}
        <div className='flex justify-between items-center mb-4'>
          <span className='text-zinc-500 text-sm'>Frequency</span>
          <span
            className={`${
              challenge.frequency === 'DAILY'
                ? 'text-green-500'
                : challenge.frequency === 'ONE TIME'
                  ? 'text-amber-500'
                  : 'text-blue-500'
            } text-xs`}
          >
            {challenge.frequency}
          </span>
        </div>

        {/* CTA row - only show if not completed */}
        {!challenge.completed && challenge.ctaLink && (
          <div className='flex justify-between items-center mt-auto'>
            <span className='text-zinc-500 text-sm'>CTA</span>
            <Link
              href={challenge.ctaLink}
              className='bg-zinc-800 hover:bg-zinc-700 rounded-md px-4 py-2 text-sm transition-colors'
            >
              {challenge.ctaText || 'Chat'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
