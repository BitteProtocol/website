'use client';

import React, { useState, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';
import { useEarnChallenges, useLeaderboard } from '@/hooks/useEarnChallenges';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChallengeCard } from '@/components/ui/earn/ChallengeCard';
import { ChallengeCardSkeleton } from '@/components/ui/earn/ChallengeCardSkeleton';
import { ErrorDisplay } from '@/components/ui/earn/ErrorDisplay';
import { LeaderboardTable } from '@/components/ui/earn/LeaderboardTable';

export default function EarnPage() {
  const [activeTab, setActiveTab] = useState<string>('earn');
  const {
    challenges,
    stats,
    loading: challengesLoading,
    error: challengesError,
    refreshChallenges,
  } = useEarnChallenges();

  // State to track if we should show two columns layout
  const [showTwoColumns, setShowTwoColumns] = useState(false);

  // Check window width on client side to determine layout
  useEffect(() => {
    const handleResize = () => {
      setShowTwoColumns(window.innerWidth >= 2000);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className='min-h-screen text-white px-6 py-4'>
      <div className='mx-auto'>
        {/* Top section with payout info and tabs */}
        <div className='flex flex-col md:flex-row justify-between mb-5 space-y-4 md:space-y-0 items-center'>
          <div className='flex space-x-4'>
            {/* Next payout box */}
            <div className='bg-zinc-900 rounded-md p-4 min-w-[215px]'>
              <div className='text-zinc-500 text-xs mb-4 flex items-center justify-between uppercase font-medium'>
                NEXT PAYOUT
                <HelpCircle className='w-4 h-4 cursor-pointer' />
              </div>
              <div className='text-sm'>{stats.nextPayoutDate}</div>
            </div>

            {/* Amount box */}
            <div className='bg-zinc-900 rounded-md p-4 min-w-[215px]'>
              <div className='text-zinc-500 text-xs mb-4 flex items-center justify-between uppercase font-medium'>
                AMOUNT
                <HelpCircle className='w-4 h-4 cursor-pointer' />
              </div>
              <div className='text-sm flex items-center'>
                <div className='w-4 h-4 bg-white rounded-full mr-2 flex items-center justify-center'>
                  <img
                    src='/bitte-symbol-black.svg'
                    alt='BITTE'
                    className='w-2.5 h-2.5'
                  />
                </div>
                {stats.totalReward}
                <span className='text-sm text-zinc-500 ml-1'>$BITTE</span>
              </div>
            </div>
          </div>

          {/* Tabs using shadcn Tabs component */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='w-[250px]'
          >
            <TabsList className='h-[42px] w-full bg-zinc-900 p-1'>
              <TabsTrigger
                value='earn'
                className='flex-1 h-full text-white data-[state=active]:bg-zinc-800 data-[state=active]:shadow-none'
              >
                Earn
              </TabsTrigger>
              <TabsTrigger
                value='leaderboard'
                className='flex-1 h-full text-white data-[state=active]:bg-zinc-800 data-[state=active]:shadow-none'
              >
                Leaderboard
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Main content area */}
        {activeTab === 'earn' ? (
          <div className='bg-zinc-900 border-t border-l border-r border-[#313E52] rounded-md overflow-hidden'>
            <div className='flex flex-col lg:flex-row'>
              {/* Left side - Text content */}
              <div className='p-6 lg:w-72'>
                <h1 className='text-xl font-semibold mb-2'>Earn</h1>
                <p className='text-zinc-500 text-sm'>
                  Qualify for earnings by performing actions listed here.
                  Payouts are executed in $BITTE token every Tuesday.
                </p>

                {/* Error handling */}
                {challengesError && (
                  <div className='mt-4'>
                    <ErrorDisplay
                      message={challengesError}
                      onRetry={refreshChallenges}
                    />
                  </div>
                )}
              </div>

              {/* Right side - Challenge cards */}
              <div className='flex-1 p-6 overflow-auto'>
                <div className='flex justify-center w-full'>
                  {/* Card container with dynamic layout based on screen size */}
                  <div
                    className={`
                    flex flex-col
                    space-y-5
                    transition-all duration-300
                    w-[415px]
                    2xl:min-w-[415px]
                    ${showTwoColumns ? 'grid grid-cols-2 gap-6 w-full max-w-[1120px] space-y-0' : '2xl:w-[clamp(415px,30vw,550px)]'}
                  `}
                  >
                    {challengesLoading
                      ? // Skeleton loading state
                        Array.from({ length: showTwoColumns ? 6 : 3 }).map(
                          (_, index) => (
                            <div key={`skeleton-${index}`} className='w-full'>
                              <ChallengeCardSkeleton />
                            </div>
                          )
                        )
                      : // Actual challenge cards
                        challenges.map((challenge) => (
                          <div key={challenge.id} className='w-full'>
                            <ChallengeCard challenge={challenge} />
                          </div>
                        ))}
                  </div>
                </div>
              </div>
            </div>
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
    <LeaderboardTable
      leaderboard={leaderboard}
      loading={loading}
      error={error}
      refreshLeaderboard={refreshLeaderboard}
    />
  );
}
