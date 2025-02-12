'use client';

import '@bitte-ai/chat/style.css';
import { useBitteWallet } from '@bitte-ai/react';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { AgentData } from '@/components/layout/Home';
import AgentSelector from '@/components/ui/agents/AgentSelector';
import Filters from '@/components/ui/agents/Filters';
import { Filters as AgentFilters, RegistryData } from '@/lib/types/agent.types';
import { MB_URL } from '@/lib/url';
import { cn } from '@/lib/utils';
import { filterHandler } from '@/lib/utils/filters';
import Link from 'next/link';
import { Button } from '../ui/button';
import AiChat from './AiChat';

const Hero = ({ agentData }: { agentData: AgentData }) => {
  const [selectedAgent, setSelectedAgent] = useState<RegistryData | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<AgentFilters[]>([]);

  const { isConnected } = useBitteWallet();

  const { isConnected: isEvmConnected } = useAccount();
  const isWalletDisconnected = !isConnected && !isEvmConnected;

  const filteredAgents = selectedFilters?.length
    ? agentData.agents.filter((agent) => {
        if (!agent) return false;

        return selectedFilters.every((filter) => {
          if (filter.label === 'Category' && agent.category) {
            return filter.values.includes(agent.category);
          }
          return true;
        });
      })
    : agentData.agents;

  const handleFilterClick = (value: string, label: string) => {
    setSelectedFilters((prevFilters) =>
      filterHandler(prevFilters, value, label)
    );
  };

  useEffect(() => {
    if (agentData.agents.length) {
      setSelectedAgent(agentData.agents[0]);
    }
  }, [agentData]);

  useEffect(() => {
    // Retrieve the selected agent from sessionStorage when the component mounts
    const storedAgent = sessionStorage.getItem('selectedAgent');
    if (storedAgent) {
      setSelectedAgent(JSON.parse(storedAgent));
    }
  }, []);

  useEffect(() => {
    // Save the selected agent to sessionStorage whenever it changes
    if (selectedAgent) {
      sessionStorage.setItem('selectedAgent', JSON.stringify(selectedAgent));
    }
  }, [selectedAgent]);

  return (
    <section className='w-full'>
      <div className='relative'>
        {isWalletDisconnected ? (
          <video
            autoPlay
            loop
            playsInline
            muted
            className='absolute w-screen h-full object-cover border-b border-[#313E52] opacity-20'
          >
            <source src='/video/brains.mp4' type='video/mp4' />
          </video>
        ) : null}
        <div
          className={cn(
            'flex justify-center flex-col text-center items-center px-8 py-28',
            isWalletDisconnected
              ? 'pt-14 md:pt-12 lg:pt-12 xl:pt-24 2xl:pt-40'
              : 'pt-4'
          )}
        >
          {isWalletDisconnected ? (
            <div className='z-10 md:pointer-events-none'>
              <p className='font-semibold text-white text-[32px] md:text-[40px] leading-tight mx-auto '>
                What transaction can we help you with?
              </p>
            </div>
          ) : null}
          <div className='mt-10 z-10 flex flex-col w-full '>
            <div className='-mx-8 lg:-mx-0'>
              <Filters
                filters={agentData?.filters}
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterClick}
                isHome
              />
            </div>
          </div>

          <div className='mt-6 z-10 flex flex-col lg:flex-row gap-6 lg:h-[500px] 2xl:h-[800px] w-full 2xl:w-4/5'>
            <div className='z-10 -mx-8 lg:-mx-0'>
              <AgentSelector
                agentData={filteredAgents}
                onSelectAgent={setSelectedAgent}
                selectedAgent={selectedAgent}
              />
            </div>
            <div className='lg:w-full h-[560px] lg:h-full -mx-8 lg:-mx-0'>
              <AiChat selectedAgent={selectedAgent} />
            </div>
          </div>
          <div className='mt-11 flex items-center justify-center gap-3 md:gap-6 z-10'>
            <Link href='/registry'>
              <Button variant='secondary' className='w-full md:w-[200px]'>
                Browse Agents
              </Button>
            </Link>
            <Button asChild variant='secondary' className='w-full md:w-[200px]'>
              <Link href={MB_URL.DEV_DOCS} target='_blank'>
                Build Chain Agent
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
