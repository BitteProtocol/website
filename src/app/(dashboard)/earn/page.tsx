'use client';

import React, { useState } from 'react';
import { CheckCircle, ChevronRight, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useEarnChallenges, useLeaderboard } from '@/hooks/useEarnChallenges';
import { Loader } from '@/components/ui/loader';

// Types
/* interface Challenge {
  id: string;
  title: string;
  reward: number;
  frequency: 'ONE TIME' | 'DAILY' | 'WEEKLY';
  completed: boolean;
  ctaText: string;
  ctaLink: string;
} */

type ActiveTab = 'earn' | 'leaderboard';

// Simple error display component
function ErrorDisplay({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className='bg-red-500/10 border border-red-500/50 rounded-md p-4 mb-4'>
      <div className='flex items-start gap-4'>
        <div className='text-red-500'>⚠️</div>
        <div className='flex-1'>
          <p className='text-red-500'>{message}</p>
        </div>
        <button
          onClick={onRetry}
          className='flex items-center gap-2 text-sm text-zinc-400 hover:text-white'
        >
          <RefreshCw size={14} />
          Retry
        </button>
      </div>
    </div>
  );
}

export default function EarnPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('earn');
  const {
    challenges,
    stats,
    loading: challengesLoading,
    error: challengesError,
    refreshChallenges,
  } = useEarnChallenges();

  return (
    <div className='min-h-screen bg-black text-white p-6'>
      <div className='max-w-6xl mx-auto'>
        {/* Top section with payout info and tabs */}
        <div className='flex flex-col md:flex-row justify-between mb-8 space-y-4 md:space-y-0'>
          <div className='flex space-x-4'>
            {/* Next payout box */}
            <div className='bg-zinc-900 rounded-md p-4 min-w-[200px]'>
              <div className='text-zinc-500 text-xs mb-2 flex items-center'>
                NEXT PAYOUT
                <span className='ml-1 cursor-pointer'>
                  <svg
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <circle
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='1.5'
                    />
                    <path
                      d='M12 8V12M12 16V16'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </span>
              </div>
              <div className='font-medium'>{stats.nextPayoutDate}</div>
            </div>

            {/* Amount box */}
            <div className='bg-zinc-900 rounded-md p-4 min-w-[150px]'>
              <div className='text-zinc-500 text-xs mb-2 flex items-center'>
                AMOUNT
                <span className='ml-1 cursor-pointer'>
                  <svg
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <circle
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='1.5'
                    />
                    <path
                      d='M12 8V12M12 16V16'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </span>
              </div>
              <div className='font-medium flex items-center'>
                <div className='w-4 h-4 bg-white rounded-full mr-2 flex items-center justify-center'>
                  <span className='text-black text-xs'>$</span>
                </div>
                {stats.totalReward} $BITTE
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className='flex bg-zinc-900 rounded-md overflow-hidden'>
            <button
              className={`px-4 py-2 ${activeTab === 'earn' ? 'bg-zinc-800' : ''}`}
              onClick={() => setActiveTab('earn')}
            >
              Earn
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'leaderboard' ? 'bg-zinc-800' : ''}`}
              onClick={() => setActiveTab('leaderboard')}
            >
              Leaderboard
            </button>
          </div>
        </div>

        {/* Main content area */}
        {activeTab === 'earn' ? (
          <div>
            <h1 className='text-2xl font-bold mb-2'>Earn</h1>
            <p className='text-zinc-400 mb-6'>
              Qualify for earnings by performing actions listed here. Payouts
              are executed in $BITTE token every Tuesday.
            </p>

            {/* Error handling */}
            {challengesError && (
              <ErrorDisplay
                message={challengesError}
                onRetry={refreshChallenges}
              />
            )}

            {/* Challenge cards */}
            {challengesLoading ? (
              <div className='flex justify-center items-center py-16'>
                <Loader size='lg' />
              </div>
            ) : (
              <div className='grid md:grid-cols-1 lg:grid-cols-1 gap-4'>
                {challenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className='bg-zinc-900 rounded-md overflow-hidden'
                  >
                    <div className='p-6'>
                      <div className='flex items-start gap-4'>
                        {/* Checkbox/status indicator */}
                        <div className='mt-1'>
                          {challenge.completed ? (
                            <CheckCircle className='text-green-500 w-5 h-5' />
                          ) : (
                            <div className='w-5 h-5 border border-zinc-600 rounded-full'></div>
                          )}
                        </div>

                        {/* Challenge content */}
                        <div className='flex-1'>
                          <h3 className='font-medium text-lg mb-4'>
                            {challenge.title}
                          </h3>

                          <div className='grid grid-cols-2 gap-4'>
                            <div>
                              <p className='text-zinc-500 text-xs mb-1'>
                                Reward
                              </p>
                              <div className='flex items-center'>
                                <div className='w-4 h-4 bg-white rounded-full mr-2 flex items-center justify-center'>
                                  <span className='text-black text-xs'>$</span>
                                </div>
                                <span className='font-medium'>
                                  {challenge.reward} $BITTE
                                </span>
                              </div>
                            </div>

                            <div>
                              <p className='text-zinc-500 text-xs mb-1'>
                                Frequency
                              </p>
                              <p
                                className={`${challenge.frequency === 'DAILY' ? 'text-green-500' : 'text-amber-500'}`}
                              >
                                {challenge.frequency}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* CTA button */}
                        <div>
                          <Link
                            href={challenge.ctaLink}
                            className='inline-block bg-zinc-800 hover:bg-zinc-700 rounded-md px-4 py-2'
                          >
                            {challenge.ctaText}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <LeaderboardContent />
        )}
      </div>
    </div>
  );
}

// Separate component for the Leaderboard tab
function LeaderboardContent() {
  const { leaderboard, loading, error, refreshLeaderboard } = useLeaderboard();

  return (
    <div>
      <h1 className='text-2xl font-bold mb-6'>Leaderboard</h1>

      {/* Error handling */}
      {error && <ErrorDisplay message={error} onRetry={refreshLeaderboard} />}

      {loading ? (
        <div className='flex justify-center items-center py-16'>
          <Loader size='lg' />
        </div>
      ) : (
        <div className='bg-zinc-900 rounded-md overflow-hidden'>
          <table className='min-w-full'>
            <thead className='border-b border-zinc-800'>
              <tr className='text-left'>
                <th className='py-4 px-6 font-medium text-sm'>#</th>
                <th className='py-4 px-6 font-medium text-sm'>USER</th>
                <th className='py-4 px-6 font-medium text-sm'>SOCIALS</th>
                <th className='py-4 px-6 font-medium text-sm'>NEXT PAYOUT</th>
                <th className='py-4 px-6 font-medium text-sm'>AGENT</th>
                <th className='py-4 px-6 font-medium text-sm text-right'>
                  PINGS 7D
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user) => (
                <tr
                  key={user.id}
                  className='border-b border-zinc-800 hover:bg-zinc-800/50'
                >
                  <td className='py-4 px-6'>{user.id}</td>
                  <td className='py-4 px-6'>{user.username}</td>
                  <td className='py-4 px-6'>
                    <div className='flex space-x-2'>
                      {user.hasGithub && (
                        <div className='w-6 h-6 flex items-center justify-center'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='20'
                            height='20'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          >
                            <path d='M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4'></path>
                            <path d='M9 18c-4.51 2-5-2-7-2'></path>
                          </svg>
                        </div>
                      )}
                      {user.hasTwitter && (
                        <div className='w-6 h-6 flex items-center justify-center'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='20'
                            height='20'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          >
                            <path d='M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z'></path>
                          </svg>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className='py-4 px-6'>
                    <div className='flex items-center'>
                      <div className='w-4 h-4 bg-white rounded-full mr-2 flex items-center justify-center'>
                        <span className='text-black text-xs'>$</span>
                      </div>
                      <span>{user.payout} $BITTE</span>
                    </div>
                  </td>
                  <td className='py-4 px-6'>
                    <div className='flex items-center'>
                      {user.agent}
                      <ChevronRight className='h-4 w-4 ml-1' />
                    </div>
                  </td>
                  <td className='py-4 px-6 text-right'>
                    {user.pings.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
