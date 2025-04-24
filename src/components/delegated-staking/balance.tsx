'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useBitteTokenBalances } from '@/hooks/useBitteTokenBalances';
import { Wallet } from 'lucide-react';
import { sepolia } from 'viem/chains';
import { Skeleton } from '../ui/skeleton';

const UserBalance = ({ address }: { address: `0x${string}` }) => {
  const { balances, isLoading, error, refetch } = useBitteTokenBalances(
    sepolia,
    address
  );

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
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='text-xl'>Token Balance</CardTitle>
        <CardDescription>Your available $BITTE tokens</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex items-center gap-2'>
          <Wallet className='h-8 w-8 text-primary' />
          <div>
            {isLoading ? (
              <Skeleton className='h-8 w-32' />
            ) : (
              <div className='text-3xl font-bold'>
                {balances?.bitte.balance}
              </div>
            )}
            <p className='text-sm text-muted-foreground'>
              Available for staking
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserBalance;
