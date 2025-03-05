'use client';

import { useVerifiedAssistants } from '@/hooks/useAssistants';
import { AGENT_IDS } from '@/lib/agentConstants';
import { RegistryData } from '@/lib/types/agent.types';
import { MB_URL } from '@/lib/url';
import '@bitte-ai/chat/style.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import AgentRow from './AgentRow';
import HeroPromptInput from './HeroPromptInput';

const Hero = () => {
  const { verifiedAgents: agentData, loading } = useVerifiedAssistants();
  const [selectedAgent, setSelectedAgent] = useState<RegistryData | null>(null);

  useEffect(() => {
    if (agentData?.agents?.length) {
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

  // Filter agents to include only the specified IDs
  const filteredAgents = agentData?.agents.filter((agent) =>
    AGENT_IDS.includes(agent.id)
  );

  return (
    <section className='w-full'>
      <div className='relative'>
        <video
          autoPlay
          loop
          playsInline
          muted
          className='absolute md:-top-20 w-screen h-full object-cover border-b border-[#313E52] opacity-20 z-0'
        >
          <source src='/video/human_1.mp4' type='video/mp4' />
        </video>
        <div className='flex justify-center flex-col text-center items-center px-8 pt-20 md:pt-12 lg:pt-20 xl:pt-24 2xl:pt-60 pb-56  2xl:pb-80'>
          <div className='z-10 md:pointer-events-none'>
            <p className='font-semibold text-white text-opacity-30 text-[32px] md:text-[50px] leading-tight mx-auto '>
              Chat with Dapps
            </p>
          </div>
          <div className='mt-10 z-10 flex flex-col w-full'>
            <div className='flex flex-col gap-4'>
              <div className='flex-grow lg:w-1/2 4k:w-[1300px] mx-auto'>
                <HeroPromptInput />
              </div>
              <div className='flex-grow'>
                {filteredAgents && filteredAgents?.length > 0 ? (
                  <AgentRow agentData={filteredAgents} />
                ) : loading ? (
                  <div className='flex gap-6 items-center justify-center my-10'>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className='w-[300px] h-[135px]' />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className='mt-7 flex flex-wrap items-center justify-center gap-3 md:gap-6 z-10'>
            <Link href='/agents'>
              <Button variant='secondary' className='w-fit md:w-[200px]'>
                Browse Agents
              </Button>
            </Link>
            <Button asChild variant='secondary' className='w-fit md:w-[200px]'>
              <Link href={MB_URL.DEV_DOCS} target='_blank'>
                Build Agent
              </Link>
            </Button>
            <Button asChild variant='secondary' className='w-fit md:w-[200px]'>
              <Link href={MB_URL.EMBED_DOCS} target='_blank'>
                Embed Agent
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
