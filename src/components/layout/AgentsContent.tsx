'use client';

import dynamic from 'next/dynamic';
import { useAllAssistants } from '@/hooks/useAssistants';
import { Skeleton } from '../ui/skeleton';

const AllAgentsWithNoSSR = dynamic(
  () => import('@/components/ui/agents/AllAgents'),
  { ssr: false }
);

const AgentContent = () => {
  const { allAgents: data, loading } = useAllAssistants();

  if (loading) {
    return (
      <div className='flex gap-3'>
        <Skeleton className='w-full md:w-1/3 h-[70vh]' />
        <Skeleton className='w-2/3 h-[70vh] hidden md:block' />
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
