'use client';

import dynamic from 'next/dynamic';
import { Filters, RegistryData } from '@/lib/types/agent.types';

const AllAgentsWithNoSSR = dynamic(
  () => import('@/components/ui/agents/AllAgents'),
  { ssr: false }
);

const AgentContent = ({
  data,
}: {
  data: {
    agents: RegistryData[];
    filters: Filters[];
    unverifiedAgents: RegistryData[];
  };
}) => {
  return (
    <div className='relative z-30'>
      <AllAgentsWithNoSSR
        templates={data.agents}
        filters={data.filters}
        unverifiedAgents={data.unverifiedAgents}
      />
    </div>
  );
};

export default AgentContent;
