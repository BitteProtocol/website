import { BITTE_AGENTID } from '@/lib/agentConstants';
import { fetchVerifiedAssistants } from '@/lib/data/fetchVerifiedAssistants';

import { AGENT_IDS } from '@/lib/agentConstants';
import { RegistryData } from '@/lib/types/agent.types';
import { MB_URL } from '@/lib/url';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import AgentRow from './AgentRow';
import HeroPromptInput from './HeroPromptInput';

export default async function NewHero() {
  const agentData = await fetchVerifiedAssistants();

  // Map and ensure all required properties exist
  const mappedAgentData = agentData
    ? {
        ...agentData,
        agents:
          agentData.agents?.map((agent) => ({
            ...agent,
            id: agent.id || BITTE_AGENTID,
            name: agent.name || 'Bitte Assistant',
            image: agent.image || '/logo.svg',
            chainIds: [...new Set(agent?.chainIds || [])],
          })) || [],
        filters: agentData.filters || [],
      }
    : { agents: [], filters: [] };

  // Filter agents to include only the specified IDs
  const filteredAgents = mappedAgentData?.agents.filter((agent: RegistryData) =>
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
          poster='./black-bg.webp'
          className='absolute md:-top-20 w-screen h-full object-cover border-b border-mb-gray-750 opacity-30 z-0'
        >
          <source src='/video/map_black.mp4' type='video/mp4' />
        </video>
        <div className='flex justify-center flex-col text-center items-center px-8 pt-20 md:pt-12 lg:pt-20 xl:pt-24 2xl:pt-60 pb-56  2xl:pb-80'>
          <div className='z-10 md:pointer-events-none'>
            <p className='font-semibold text-white text-[32px] md:text-[50px] leading-tight mx-auto '>
              Chat with Dapps
            </p>
          </div>
          <div className='mt-10 z-10 flex flex-col w-full'>
            <div className='flex flex-col gap-4'>
              <div className='flex-grow w-full lg:w-1/2 4k:w-[1300px] mx-auto'>
                <HeroPromptInput />
              </div>
              <div className='flex-grow mt-6'>
                {filteredAgents && filteredAgents?.length > 0 ? (
                  <AgentRow agentData={filteredAgents} />
                ) : (
                  <>
                    <div className='hidden gap-6 items-center justify-center lg:flex'>
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className='w-[300px] h-[128px]' />
                      ))}
                    </div>
                    <div className='flex gap-6 lg:hidden'>
                      <Skeleton className='w-full h-[128px]' />
                      <Skeleton className='w-full h-[128px]' />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className='mt-6 flex flex-wrap items-center justify-center gap-3 md:gap-6 z-10'>
            <Button asChild variant='secondary' className='w-fit md:w-[200px]'>
              <Link href='/build-agents'>Build Agent</Link>
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
}
