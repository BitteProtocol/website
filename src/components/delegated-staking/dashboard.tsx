'use client';

import { AgentsList } from './agents-list';
import { UserBalance } from './balance';

export default function Dashboard() {
  /* const { address } = useAccount(); */
  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold mb-2'>$BITTE Dashboard</h1>
        <p className='text-muted-foreground mb-8'>
          Manage your tokens and staking
        </p>

        <div className='grid gap-6'>
          <UserBalance address='0x7f01D9b227593E033bf8d6FC86e634d27aa85568' />
          <AgentsList address='0x7f01D9b227593E033bf8d6FC86e634d27aa85568' />
        </div>
      </div>
    </div>
  );
}
