'use client';
import { RegistryData, Filters } from '@/lib/types/agent.types';
import { RegistryBanner } from './RegistryBanner';
import AllAgents from '@/components/ui/agents/AllAgents';
import { AgentStarterCard } from '../ui/agents/AgentStarterCard';
import Image from 'next/image';

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
      <div className='hidden md:block absolute top-0 left-0 w-full -mt-24 lg:-mt-0 h-[320px] md:h-screen bg-no-repeat bg-right-top bg-right md:bg-[url("/registry_banner_new.svg")] z-0'></div>
      <Image
        src={'/registry_banner_mobile_new.svg'}
        className='block md:hidden w-full max-h-[300px] -mt-20 md:scale-125'
        alt='mobile-banner-logo'
        loading='lazy'
        width={100}
        height={80}
      />
      <div className='container z-20 relative m-auto flex-grow -mt-24 md:-mt-0'>
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
