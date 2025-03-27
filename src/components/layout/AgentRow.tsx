'use client';

import { Card } from '@/components/ui/card';
import { ACTION_TEXTS } from '@/lib/agentConstants';
import { RegistryData } from '@/lib/types/agent.types';
import { mapChainIdsToNetworks } from '@/lib/utils/chainIds';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '../ui/button';
import InfoTooltip from '../ui/InfoTooltip';
import AgentImage from './AgentImage';

export default function AgentRow({ agentData }: { agentData: RegistryData[] }) {
  const router = useRouter();

  useEffect(() => {
    // Prefetch the /chat route to make navigation faster
    router.prefetch('/chat');
  }, [router]);

  return (
    <section className='relative'>
      <div className='flex hero-xl:items-center hero-xl:justify-center overflow-x-auto space-x-6 disable-scrollbars -mx-8 hero-xl:-mx-0 pl-6 hero-xl:pl-0'>
        {agentData?.map((agent) => (
          <Card
            key={agent.id}
            className='flex-shrink-0 flex flex-col min-w-[306px] min-h-[125px] p-4 bg-[#18181A] border-none hover:bg-black/50 transition-colors cursor-pointer'
            onClick={() =>
              router.replace(
                `/chat?agentid=${agent.id}&prompt=${ACTION_TEXTS[agent.id]}`
              )
            }
          >
            <div className='flex items-start gap-3 mb-4'>
              <div className='relative w-12 h-12 rounded-md overflow-hidden'>
                <AgentImage
                  src={agent.image}
                  alt={`${agent.name} logo`}
                  width={48}
                  height={48}
                  className='object-cover rounded-md'
                  loading='lazy'
                  unoptimized
                />
              </div>
              <div className='flex flex-col gap-1'>
                <span className='text-base font-medium text-white text-left'>
                  {agent.name}
                </span>
                {agent.chainIds ? (
                  <div className='flex gap-1'>
                    {mapChainIdsToNetworks(agent.chainIds).map(
                      (network, index) => (
                        <InfoTooltip
                          key={`${agent.name}-${network.name}-${index}`}
                          text={network.name}
                          delay={130}
                          trigger={
                            <div className='relative w-5 h-5'>
                              <Image
                                src={network.icon}
                                alt={`${network.name} icon`}
                                fill
                                className='object-contain rounded-md'
                              />
                            </div>
                          }
                        />
                      )
                    )}
                  </div>
                ) : null}
              </div>
            </div>

            <Link
              href={`/chat?agentid=${agent.id}&prompt=${ACTION_TEXTS[agent.id]}`}
              className='flex items-center justify-start'
            >
              <Button
                size='sm'
                className='bg-mb-blue-30 hover:bg-mb-blue-100/40 text-mb-blue-100 h-8'
              >
                <span className='flex items-center gap-1 text-[13px]'>
                  {ACTION_TEXTS[agent.id]}
                  <ArrowUpRight size={16} />
                </span>
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}
