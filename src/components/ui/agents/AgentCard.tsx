'use client';

import AgentImage from '@/components/layout/AgentImage';
import { Button } from '@/components/ui/button';
import type { RegistryData } from '@/lib/types/agent.types';
import { getCoverImageUrl, getRunAgentUrl } from '@/lib/utils/agent';
import { mapChainIdsToNetworks } from '@/lib/utils/chainIds';
import { shortenString } from '@/lib/utils/strings';
import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface AgentCardProps {
  agent: RegistryData;
}

export default function AgentCard({
  agent,
}: AgentCardProps): JSX.Element | null {
  if (!agent) return null;

  const goToAgentDetail = (message: string) => {
    const encodedPrompt = encodeURIComponent(message);
    return `/agents/${agent.id}?prompt=${encodedPrompt}`;
  };

  const coverImage = getCoverImageUrl(agent.image);
  const runAgentUrl = getRunAgentUrl(agent.id, agent.verified);

  const mappedChainIds = mapChainIdsToNetworks(
    agent?.chainIds?.length ? agent.chainIds : [0],
    true
  ); // default to NEAR

  return (
    <div className='bg-gradient-to-b from-mb-gray-750 to-mb-black-50 p-[1px] rounded-xl md:rounded-lg cursor-pointer h-[336px] md:h-[254px]'>
      <div className='bg-mb-black-50 rounded-xl md:rounded-lg p-4 hover:bg-mb-dark-blue-2 transition-all duration-500 h-full flex flex-col'>
        <Link
          href={goToAgentDetail('Hey, what can you do for me?')}
          className='flex flex-col h-full'
        >
          <div className='flex flex-col md:flex-row md:justify-between md:items-start gap-4 md:gap-0 mb-4'>
            <div className='flex items-center gap-3'>
              <div
                className='w-12 h-12 md:w-10 md:h-10 rounded-lg md:rounded flex items-center justify-center'
                style={{
                  backgroundColor: agent?.image?.includes('placeholder')
                    ? '#141418'
                    : 'transparent',
                }}
              >
                <AgentImage
                  src={coverImage}
                  alt={agent.name}
                  width={40}
                  height={40}
                  className='rounded-md'
                />
              </div>
              <div className='flex flex-col'>
                <span className='font-medium'>{agent.name}</span>
                <span className='text-sm text-mb-gray-150 md:hidden truncate max-w-[160px]'>
                  By {agent.accountId}
                </span>
              </div>
            </div>
            <Button
              variant='secondary'
              className='hidden md:inline-flex'
              asChild
            >
              <Link href={runAgentUrl}>Run Agent</Link>
            </Button>
          </div>

          <div className='flex-grow overflow-hidden'>
            <p className='text-xs md:text-sm text-mb-gray-200 mb-6 md:mb-4'>
              {shortenString(agent?.description || '', 150)}
            </p>
          </div>

          <div className='mt-auto'>
            <div className='flex flex-wrap gap-2 items-center'>
              <span className='hidden md:inline-flex text-sm text-mb-gray-200 truncate max-w-[400px]'>
                By {agent.accountId}
              </span>
              {agent.category && (
                <span className='text-xs font-medium px-2.5 py-1 bg-mb-gray-600 rounded-full'>
                  {agent.category}
                </span>
              )}
              {agent.verified ? (
                <span className='text-xs font-medium px-2.5 py-1 bg-mb-green-20 text-mb-green-100 rounded-full flex items-center gap-1'>
                  <CheckCircle2 className='w-3 h-3' />
                  Verified
                </span>
              ) : (
                <span className='text-xs font-medium px-2.5 py-1 bg-mb-purple-20 text-mb-purple rounded-full'>
                  Playground
                </span>
              )}
            </div>

            <div className='flex items-center gap-2 mt-4'>
              <span className='text-xs md:text-sm text-mb-gray-200 w-auto hidden md:block md:mb-0'>
                Chains
              </span>

              <div className='flex items-center gap-2 flex-wrap'>
                {mappedChainIds.slice(0, 3).map((network, index) => (
                  <div
                    key={index}
                    className='flex items-center gap-1.5 bg-mb-gray-600 px-2.5 py-1 rounded-full'
                  >
                    <div className='relative w-4 h-4'>
                      <Image
                        src={network.icon}
                        alt={`${network.name} icon`}
                        fill
                        className='object-contain rounded'
                        loading='lazy'
                        quality={60}
                        priority={false}
                      />
                    </div>

                    <span className='text-xs font-medium'>{network.name}</span>
                  </div>
                ))}

                {mappedChainIds?.length > 3 && (
                  <div className='relative group'>
                    <span className='text-xs font-medium bg-mb-gray-600 text-white py-1 px-2.5 rounded-full cursor-help'>
                      +{mappedChainIds.length - 3}
                    </span>
                    <div className='absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 invisible group-hover:visible bg-mb-gray-600 text-white rounded-lg py-1 px-2 w-fit shadow-lg z-10'>
                      <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2'></div>
                      <div className='flex flex-col gap-1.5'>
                        {mappedChainIds.slice(3).map((network, index) => (
                          <div key={index} className='flex items-center gap-2'>
                            <div className='relative w-4 h-4'>
                              <Image
                                src={network.icon}
                                alt={`${network.name} icon`}
                                fill
                                className='object-contain rounded'
                                loading='lazy'
                                quality={60}
                                priority={false}
                              />
                            </div>
                            <span className='text-xs font-medium'>
                              {network.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Button
              variant='secondary'
              className='w-full mt-6 md:hidden'
              asChild
            >
              <Link href={runAgentUrl}>Run Agent</Link>
            </Button>
          </div>
        </Link>
      </div>
    </div>
  );
}
