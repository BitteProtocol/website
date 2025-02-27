'use client';

import dynamic from 'next/dynamic';
import { Filters, RegistryData } from '@/lib/types/agent.types';
import { useAllAssistants } from '@/hooks/useAssistants';
import { Skeleton } from '../ui/skeleton';

const AllAgentsWithNoSSR = dynamic(
  () => import('@/components/ui/agents/AllAgents'),
  { ssr: false }
);

const AgentContent = () => {
  const { allAgents: data, loading, error } = useAllAssistants();

  if (loading) {
    return (
      <div className='flex gap-3'>
        <Skeleton className='w-1/6 h-[100vh]' />
        <Skeleton className='w-1/6 h-[45vh] mt-20' />
        <Skeleton className='w-4/6 h-[100vh] mt-20' />
      </div>
    );
  }

  return (
    <div className='relative z-30'>
      <AllAgentsWithNoSSR
        agents={data?.agents || []}
        filters={data?.filters || []}
        unverifiedAgents={data?.unverifiedAgents || []}
      />
    </div>
  );
};

export default AgentContent;
