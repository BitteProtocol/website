'use client';

import { useAccount } from 'wagmi';
import AgentsList from './agents-list';
import UserBalance from './balance';

const Dashboard = () => {
  const { address } = useAccount();
  if (!address) return null;

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold mb-2'>$BITTE Dashboard</h1>
        <p className='text-muted-foreground mb-8'>
          Manage your tokens and staking
        </p>

        <div className='grid gap-6'>
          <UserBalance address={address} />
          <AgentsList address={address} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
