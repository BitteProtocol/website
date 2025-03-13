'use client';

import { Button } from '@/components/ui/button';
import type { RegistryData } from '@/lib/types/agent.types';
import { getCoverImageUrl, getRunAgentUrl } from '@/lib/utils/agent';
import { mapChainIdsToNetworks } from '@/lib/utils/chainIds';
import { shortenString } from '@/lib/utils/strings';
import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

interface AgentCardProps {
  agent: RegistryData;
}

export default function AgentCard({
  agent,
}: AgentCardProps): JSX.Element | null {
  if (!agent) return null;

  /*  const goToAgentDetail = (message: string) => {
    const encodedPrompt = encodeURIComponent(message);
    return `/agents/${agent.id}?prompt=${encodedPrompt}`;
  }; */

  const coverImage = getCoverImageUrl(agent.image);
  const runAgentUrl = getRunAgentUrl(agent.id, agent.verified);

  return (
    <div className='bg-[#18181b] md:bg-[#18181b] rounded-xl md:rounded-lg p-4 border border-[#27272a]'>
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
            <Image
              src={coverImage || '/placeholder.svg'}
              alt={agent.name}
              width={40}
              height={40}
              className='rounded-md'
            />
          </div>
          <div className='flex flex-col'>
            <span className='font-medium text-lg md:text-base'>
              {agent.name}
            </span>
            <span className='text-sm text-[#7c7c7c] md:hidden'>
              By {agent.accountId}
            </span>
          </div>
        </div>
        <Button
          variant='secondary'
          className='hidden md:inline-flex bg-[#27272a] hover:bg-[#333336] text-white text-xs px-3 py-1 h-8'
          onClick={() => (window.location.href = runAgentUrl)}
        >
          Run Agent
        </Button>
      </div>

      <p className='text-base md:text-sm text-[#a1a1a9] mb-6 md:mb-4'>
        {shortenString(agent?.description || '', 150)}
      </p>

      <div className='space-y-4 md:space-y-3'>
        <div className='flex flex-wrap gap-2'>
          <span className='hidden md:inline-flex text-xs text-[#7c7c7c]'>
            By {agent.accountId}
          </span>
          {agent.category && (
            <span className='text-sm md:text-xs px-3 md:px-2 py-1 md:py-0.5 bg-[#27272a] rounded-full'>
              {agent.category}
            </span>
          )}
          {agent.verified ? (
            <span className='text-sm md:text-xs px-3 md:px-2 py-1 md:py-0.5 bg-[#22C55E33] text-[#22C55E] rounded-full flex items-center gap-1'>
              <CheckCircle2 className='w-3 h-3' />
              Verified
            </span>
          ) : (
            <span className='text-sm md:text-xs px-3 md:px-2 py-1 md:py-0.5 bg-[#C084FC33] text-[#C084FC] rounded-full'>
              Playground
            </span>
          )}
        </div>

        <div>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='text-sm md:text-xs text-[#7c7c7c] w-full md:w-auto mb-2 md:mb-0'>
              Chains
            </span>
            {agent.chainIds && agent.chainIds.length > 0 && (
              <div className='flex items-center gap-2'>
                {mapChainIdsToNetworks(agent.chainIds)
                  .slice(0, 2)
                  .map((network, index) => (
                    <div
                      key={index}
                      className='flex items-center gap-1 bg-[#27272a] md:bg-transparent px-2 py-1 md:p-0 rounded-full md:rounded-none'
                    >
                      <div
                        className='w-5 h-5 rounded-full flex items-center justify-center text-[10px]'
                        style={{
                          backgroundColor: getNetworkColor(network.name),
                        }}
                      >
                        {getNetworkSymbol(network.name)}
                      </div>
                      <span className='text-sm md:text-xs'>{network.name}</span>
                    </div>
                  ))}

                {agent.chainIds.length > 2 && (
                  <div className='relative group'>
                    <span className='text-sm md:text-xs text-[#7c7c7c] bg-[#27272a] md:bg-transparent px-2 py-1 md:p-0 rounded-full md:rounded-none cursor-help'>
                      +{agent.chainIds.length - 2}
                    </span>
                    <div className='absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 invisible group-hover:visible bg-[#27272a] text-white text-xs rounded p-2 w-48 shadow-lg z-10'>
                      <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-[#27272a]'></div>
                      <div className='flex flex-col gap-1.5'>
                        {mapChainIdsToNetworks(agent.chainIds)
                          .slice(2)
                          .map((network, index) => (
                            <div
                              key={index}
                              className='flex items-center gap-1.5'
                            >
                              <div
                                className='w-4 h-4 rounded-full flex items-center justify-center text-[10px]'
                                style={{
                                  backgroundColor: getNetworkColor(
                                    network.name
                                  ),
                                }}
                              >
                                {getNetworkSymbol(network.name)}
                              </div>
                              <span>{network.name}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Button
        variant='secondary'
        className='w-full mt-6 md:hidden bg-[#27272a] hover:bg-[#333336] text-white'
        onClick={() => (window.location.href = runAgentUrl)}
      >
        Run Agent
      </Button>
    </div>
  );
}

// Helper functions for network colors and symbols
function getNetworkColor(name: string): string {
  switch (name.toLowerCase()) {
    case 'ethereum':
      return '#6780e3';
    case 'near':
      return '#000000';
    case 'bitcoin':
      return '#e3923b';
    case 'base':
      return '#0052ff';
    case 'polygon':
      return '#6c00f6';
    case 'optimism':
      return '#ea3431';
    case 'solana':
      return '#f6b73c';
    case 'usdc':
      return '#2775ca';
    default:
      return '#7c7c7c';
  }
}

function getNetworkSymbol(name: string): string {
  switch (name.toLowerCase()) {
    case 'ethereum':
      return 'Ξ';
    case 'near':
      return 'N';
    case 'bitcoin':
      return '₿';
    case 'base':
      return 'B';
    case 'polygon':
      return 'P';
    case 'optimism':
      return 'O';
    case 'solana':
      return 'S';
    case 'usdc':
      return 'U';
    default:
      return name.charAt(0);
  }
}
