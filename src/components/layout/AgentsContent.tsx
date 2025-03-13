'use client';

import { useAllAssistants } from '@/hooks/useAssistants';
import dynamic from 'next/dynamic';
import PageLoaderSkeleton from './PageLoaderSkeleton';

const AllAgentsWithNoSSR = dynamic(
  () => import('@/components/ui/agents/AllAgents'),
  { ssr: false }
);

const AgentContent = () => {
  const { allAgents: data, loading } = useAllAssistants();

  if (loading) {
    return <PageLoaderSkeleton />;
  }

  console.log({ data });

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
