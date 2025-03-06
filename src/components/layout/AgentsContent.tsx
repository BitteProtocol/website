'use client';

import { useAllAssistants } from '@/hooks/useAssistants';
import { Skeleton } from '../ui/skeleton';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import PageLoaderSkeleton from './PageLoaderSkeleton';

const AllAgentsWithNoSSR = dynamic(
  () => import('@/components/ui/agents/AllAgents'),
  { ssr: false }
);

const AgentContent = () => {
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const searchParams = useSearchParams();
  const isPlayground = searchParams.get('isPlayground') === 'true';
  const { allAgents: data, loading } = useAllAssistants(offset, 30);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && !loading && hasMore) {
      setOffset((prevOffset) => prevOffset + 30);
    }
  }, [inView, loading, hasMore]);

  useEffect(() => {
    if (data) {
      const totalAgents = isPlayground
        ? data.unverifiedAgents.length
        : data.agents.length;
      if (totalAgents < 30) {
        setHasMore(false);
      }
    }
  }, [data, isPlayground]);

  return (
    <div className='relative z-30'>
      <AllAgentsWithNoSSR
        agents={data?.agents || []}
        filters={data?.filters || []}
        unverifiedAgents={data?.unverifiedAgents || []}
      />
      {loading && <PageLoaderSkeleton />}
      <div ref={ref} />
    </div>
  );
};

export default AgentContent;
