'use client';
import { RegistryData, Filters } from '@/lib/types/agent.types';
import { RegistryBanner } from './RegistryBanner';
import AllAgents from '@/components/ui/agents/AllAgents';
import { AgentStarterCard } from '../ui/agents/AgentStarterCard';

export const RegistryUI = ({
  agents,
  filters,
  unverifiedAgents,
}: {
  agents: RegistryData[];
  unverifiedAgents: RegistryData[];
  filters: Filters[];
}) => {
  return (
    <div className='relative w-full min-h-screen flex flex-col'>
      <div className='absolute top-0 left-0 w-full -mt-24 lg:-mt-0 h-[320px] md:h-screen bg-no-repeat bg-right-top md:bg-right md:bg-[url("/registry_banner_new.svg")] bg-[url("/registry_banner_mobile_new.svg")] z-0'></div>
      <div className='container z-20 relative m-auto flex-grow mt-[150px] md:mt-0'>
        <RegistryBanner />
        <AgentStarterCard />
        <div className='relative z-30'>
          <AllAgents
            templates={agents}
            filters={filters}
            unverifiedAgents={unverifiedAgents}
          />
        </div>
      </div>
    </div>
  );
};
