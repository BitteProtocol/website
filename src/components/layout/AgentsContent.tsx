'use client';

import dynamic from 'next/dynamic';
import { useAllAssistants } from '@/hooks/useAssistants';
import { Skeleton } from '../ui/skeleton';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const AllAgentsWithNoSSR = dynamic(
  () => import('@/components/ui/agents/AllAgents'),
  { ssr: false }
);

const AgentContent = () => {
  const [offset, setOffset] = useState(1);
  const { allAgents: data, loading } = useAllAssistants(offset, 50);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && !loading) {
      setOffset((prevPage) => prevPage + 1);
    }
  }, [inView, loading]);

  /* if (loading) {
    return (
      <div className='flex gap-3'>
        <Skeleton className='w-1/3 h-[70vh]' />
        <Skeleton className='w-2/3 h-[70vh]' />
      </div>
    );
  } */

  return (
    <div className='relative z-30'>
      <AllAgentsWithNoSSR
        agents={data?.agents || []}
        filters={data?.filters || []}
        unverifiedAgents={data?.unverifiedAgents || []}
      />
      {loading && (
        <div className='flex gap-3'>
          <Skeleton className='w-1/3 h-[70vh]' />
          <Skeleton className='w-2/3 h-[70vh]' />
        </div>
      )}
      <div ref={ref} />
    </div>
  );
};

export default AgentContent;
