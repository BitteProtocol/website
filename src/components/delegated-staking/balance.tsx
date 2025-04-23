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

export function UserBalance({ address }: { address?: string }) {
  const { bitte, dBitte, sBitte } = useBitteTokenBalances(address);

  console.log({ bitte, dBitte, sBitte });

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
            <div className='text-3xl font-bold'>
              {bitte.balance.toLocaleString()} $BITTE
            </div>
            <p className='text-sm text-muted-foreground'>
              Available for staking
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
