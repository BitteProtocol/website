import React from 'react';
import { ChevronRight } from 'lucide-react';
import { ErrorDisplay } from './ErrorDisplay';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LeaderboardUser } from '@/hooks/useEarnChallenges';

interface LeaderboardTableProps {
  leaderboard: LeaderboardUser[];
  loading: boolean;
  error: string | null;
  refreshLeaderboard: () => void;
}

export function LeaderboardTable({
  leaderboard,
  loading,
  error,
  refreshLeaderboard,
}: LeaderboardTableProps) {
  if (error) {
    return <ErrorDisplay message={error} onRetry={refreshLeaderboard} />;
  }

  if (loading) {
    return (
      <div className='rounded-md overflow-hidden border border-[#313E52]'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader className='bg-[#1A1A1C]'>
              <TableRow className='border-b border-[#313E52] hover:bg-transparent'>
                <TableHead className='text-zinc-400 font-medium py-4 px-3 sm:px-6 w-12'>
                  #
                </TableHead>
                <TableHead className='text-zinc-400 font-medium py-4 px-3 sm:px-6 text-sm text-[#848485]'>
                  USER
                </TableHead>
                <TableHead className='text-zinc-400 font-medium py-4 px-3 sm:px-6 text-sm text-[#848485] hidden sm:table-cell'>
                  SOCIALS
                </TableHead>
                <TableHead className='text-zinc-400 font-medium py-4 px-3 sm:px-6 text-sm text-[#848485]'>
                  NEXT PAYOUT
                </TableHead>
                <TableHead className='text-zinc-400 font-medium py-4 px-3 sm:px-6 text-sm text-[#848485] hidden md:table-cell'>
                  AGENT
                </TableHead>
                <TableHead className='text-zinc-400 font-medium py-4 px-3 sm:px-6 text-right text-sm text-[#848485]'>
                  PINGS 7D
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className='bg-[#1A1A1C]'>
              {Array.from({ length: 8 }).map((_, index) => (
                <TableRow key={index} className='hover:bg-[#252529] border-0'>
                  <TableCell className='py-4 px-3 sm:px-6 border-0'>
                    <Skeleton className='h-4 w-4' />
                  </TableCell>
                  <TableCell className='py-4 px-3 sm:px-6 border-0'>
                    <Skeleton className='h-4 w-20 sm:w-32' />
                  </TableCell>
                  <TableCell className='py-4 px-3 sm:px-6 border-0 hidden sm:table-cell'>
                    <div className='flex space-x-2'>
                      <Skeleton className='h-6 w-6 rounded-full' />
                      <Skeleton className='h-6 w-6 rounded-full' />
                    </div>
                  </TableCell>
                  <TableCell className='py-4 px-3 sm:px-6 border-0'>
                    <div className='flex items-center'>
                      <Skeleton className='h-5 w-5 rounded-full mr-2' />
                      <Skeleton className='h-4 w-16 sm:w-24' />
                    </div>
                  </TableCell>
                  <TableCell className='py-4 px-3 sm:px-6 border-0 hidden md:table-cell'>
                    <div className='flex items-center'>
                      <Skeleton className='h-4 w-20 sm:w-28 mr-1' />
                      <Skeleton className='h-4 w-4' />
                    </div>
                  </TableCell>
                  <TableCell className='py-4 px-3 sm:px-6 text-right border-0'>
                    <div className='flex justify-end'>
                      <Skeleton className='h-4 w-12 sm:w-16' />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className='rounded-md overflow-hidden border border-[#313E52]'>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader className='bg-[#1A1A1C]'>
            <TableRow className='border-b border-[#313E52] hover:bg-transparent'>
              <TableHead className='text-zinc-400 font-medium py-4 px-3 sm:px-6 w-12'>
                #
              </TableHead>
              <TableHead className='text-zinc-400 font-medium py-4 px-3 sm:px-6 text-sm text-[#848485]'>
                USER
              </TableHead>
              <TableHead className='text-zinc-400 font-medium py-4 px-3 sm:px-6 text-sm text-[#848485] hidden sm:table-cell'>
                SOCIALS
              </TableHead>
              <TableHead className='text-zinc-400 font-medium py-4 px-3 sm:px-6 text-sm text-[#848485]'>
                NEXT PAYOUT
              </TableHead>
              <TableHead className='text-zinc-400 font-medium py-4 px-3 sm:px-6 text-sm text-[#848485] hidden md:table-cell'>
                AGENT
              </TableHead>
              <TableHead className='text-zinc-400 font-medium py-4 px-3 sm:px-6 text-right text-sm text-[#848485]'>
                PINGS 7D
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='bg-[#1A1A1C]'>
            {leaderboard.map((user) => (
              <TableRow key={user.id} className='hover:bg-[#252529] border-0'>
                <TableCell className='py-4 px-3 sm:px-6 text-zinc-200 border-0'>
                  {user.id}
                </TableCell>
                <TableCell className='py-4 px-3 sm:px-6 text-zinc-200 border-0'>
                  {user.username}
                </TableCell>
                <TableCell className='py-4 px-3 sm:px-6 border-0 hidden sm:table-cell'>
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
                          className='text-zinc-400'
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
                          className='text-zinc-400'
                        >
                          <path d='M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z'></path>
                        </svg>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className='py-4 px-3 sm:px-6 border-0'>
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
                    <span className='text-zinc-200'>
                      {user.payout}{' '}
                      <span className='text-zinc-500'>$BITTE</span>
                    </span>
                  </div>
                </TableCell>
                <TableCell className='py-4 px-3 sm:px-6 border-0 hidden md:table-cell'>
                  <div className='flex items-center text-zinc-200'>
                    {user.agent}
                    <ChevronRight className='h-4 w-4 ml-1 text-zinc-400' />
                  </div>
                </TableCell>
                <TableCell className='py-4 px-3 sm:px-6 text-right text-zinc-200 border-0'>
                  {user.pings.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
