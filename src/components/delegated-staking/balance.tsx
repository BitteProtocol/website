'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBitteTokenBalances } from '@/hooks/useBitteTokenBalances';
import { useUserDelegatedTokens } from '@/hooks/useUserDelegatedTokens';
import { Users } from 'lucide-react';
import { Chain } from 'viem/chains';
import { Skeleton } from '../ui/skeleton';

const UserBalance = ({
  chain,
  address,
}: {
  chain: Chain;
  address: `0x${string}`;
}) => {
  const { balances, isLoading, error, refetch } = useBitteTokenBalances(
    chain,
    address
  );

  const {
    delegatedTokens,
    formattedTotalDelegated,
    isLoading: delegatedTokensLoading,
    error: delegatedTokensError,
    refetch: refetchDelegatedTokens,
  } = useUserDelegatedTokens(address);

  console.log({ balances });

  // Handle balance error
  if (error) {
    return (
      <div className='p-4 bg-red-50 text-red-800 rounded-md'>
        Error loading balances: {error.message}
        <button onClick={refetch} className='ml-2 text-red-600 underline'>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 items-start'>
      {/* Token Balance Card */}
      <Card className='col-span-1'>
        <CardHeader className='pb-3'>
          <CardTitle className='text-xl'>Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center gap-2'>
            <div>
              {isLoading ? (
                <Skeleton className='h-8 w-32' />
              ) : (
                <div className='text-3xl font-bold'>
                  {balances?.bitte.balance}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staked Tokens Card */}
      <Card className='col-span-2'>
        <CardHeader className='pb-3'>
          <CardTitle className='text-xl'>Your Delegated Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          {delegatedTokensLoading ? (
            <div className='space-y-2'>
              <Skeleton className='h-12 w-full' />
              <Skeleton className='h-12 w-full' />
              <Skeleton className='h-12 w-full' />
            </div>
          ) : delegatedTokensError ? (
            <div className='p-4 bg-red-50 text-red-800 rounded-md'>
              Error loading delegated tokens: {delegatedTokensError.message}
              <button
                onClick={refetchDelegatedTokens}
                className='ml-2 text-red-600 underline'
              >
                Retry
              </button>
            </div>
          ) : delegatedTokens.length === 0 ? (
            <div className='text-center py-6 text-muted-foreground'>
              <Users className='h-12 w-12 mx-auto mb-2 opacity-50' />
              <p>You haven&apos;t delegated with any agents yet</p>
            </div>
          ) : (
            <div className='space-y-3'>
              {delegatedTokens.map((delegation) => (
                <div
                  key={delegation.delegationId}
                  className='flex items-center'
                >
                  {/* Agent Details */}
                  <div className='flex-1 min-w-0'>
                    <p className='font-medium truncate'>{delegation.agentId}</p>
                  </div>

                  {/* Delegation Amount */}
                  <div className='flex items-center'>
                    <div className='text-right'>
                      <p className='font-medium'>
                        {delegation.formattedAmount}
                      </p>
                      <p className='text-xs text-muted-foreground'>dBITTE</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Total Staked */}
              <div className='flex justify-between items-center pt-2 border-t'>
                <span className='font-medium'>Total</span>
                <Badge variant='secondary' className='text-sm'>
                  {formattedTotalDelegated} dBITTE
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserBalance;
