'use client';

import '@bitte-ai/chat/style.css';
import { useEffect, useState } from 'react';

import { AgentData } from '@/components/layout/Home';
import { RegistryData } from '@/lib/types/agent.types';
import { MB_URL } from '@/lib/url';
import Link from 'next/link';
import { Button } from '../ui/button';
import HeroPromptInput from './HeroPromptInput';

const Hero = ({ agentData }: { agentData: AgentData }) => {
  const [selectedAgent, setSelectedAgent] = useState<RegistryData | null>(null);

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
        <video
          autoPlay
          loop
          playsInline
          muted
          className='absolute w-screen h-full object-cover border-b border-[#313E52] opacity-20'
        >
          <source src='/video/brains.mp4' type='video/mp4' />
        </video>
        <div className='flex justify-center flex-col text-center items-center px-8 py-28 pt-14 md:pt-12 lg:pt-12 xl:pt-24 2xl:pt-40'>
          <div className='z-10 md:pointer-events-none'>
            <p className='font-semibold text-white text-[32px] md:text-[40px] leading-tight mx-auto '>
              What transaction can we help you with?
            </p>
          </div>
          <div className='mt-10 z-10 flex flex-col w-full '>
            {/*       <div className='-mx-8 lg:-mx-0'>
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
          </div> */}
            <div className='w-full lg:w-1/2 mx-auto'>
              <HeroPromptInput />
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
