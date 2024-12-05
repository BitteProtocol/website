'use client';

/* import { MB_URL } from '@/lib/url';
import { Button } from '../ui/button';
import AiSection from './AiSection'; */
import { AgentData } from './Home';
import AgentSelector from '../ui/agents/AgentSelector';
import { useState } from 'react';
import Filters from '../ui/agents/Filters';
import { RegistryData, Filters as AgentFilters } from '@/lib/types/agent.types';
import { filterHandler } from '@/lib/utils/filters';

const Hero = ({ agentData }: { agentData: AgentData }) => {
  const [selectedAgent, setSelectedAgent] = useState<RegistryData | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<AgentFilters[]>([]);
  // Function to handle card click

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

  return (
    <section className='w-full'>
      <div className='relative w-screen  h-full'>
        <video
          autoPlay
          loop
          playsInline
          muted
          className='absolute w-screen h-full object-cover border-b border-[#313E52] opacity-20'
        >
          <source src='/video/brains.mp4' type='video/mp4' />
        </video>
        <div className='flex justify-center flex-col text-center items-center px-8 pt-14 md:pt-12 lg:pt-12 xl:pt-24  2xl:pt-40  py-28'>
          <div className='z-10 md:pointer-events-none max-w-[530px]'>
            <p className='font-semibold text-white text-[32px] md:text-[40px] leading-tight mx-auto '>
              Interact with blockchains using natural language
            </p>
            <p className='text-mb-gray-300 md:text-[22px] font-normal mt-4 leading-tight drop-shadow-2xl'>
              On-chain agent market for transaction building with Universal Safe
              Accounts
            </p>
          </div>
          <div className='mt-20 z-10'>
            <Filters
              filters={agentData?.filters}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterClick}
              isHome
            />
          </div>
          <div className='text-center mt-6 z-10 flex items-center justify-center gap-6'>
            <div className='z-10'>
              <AgentSelector
                agentData={filteredAgents}
                onSelectAgent={setSelectedAgent}
                selectedAgent={selectedAgent}
              />
            </div>
            {/* // TO DO SANT: IMPLEMENT CHAT SOMEWHERE HERE */}
            {/* <div>
              <AiSection />
              <div className='flex justify-center'>
                <div className='mt-8 mr-5'>
                  <Button
                    variant='outline'
                    className='shadow-lg text-white hover:text-black bg-black bg-opacity-55 hover:bg-white border border-[#313E52] p-6'
                    onClick={() => handleCardClick(`${MB_URL.DEV_DOCS}`)}
                  >
                    Build Chain Agent
                  </Button>
                </div>
                <div className='mt-8'>
                  <Button
                    variant='outline'
                    className='shadow-lg text-white hover:text-black bg-black bg-opacity-55 hover:bg-white border border-[#313E52] p-6'
                    onClick={() => handleCardClick(`${MB_URL.REGISTRY}`)}
                  >
                    Agent Registry
                  </Button>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
