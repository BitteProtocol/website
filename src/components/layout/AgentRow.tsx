import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { RegistryData } from '@/lib/types/agent.types';
import { mapChainIdsToNetworks } from '@/lib/utils/chainIds';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '../ui/tooltip';

const actionTexts: Record<string, string> = {
  'near-cow-agent.vercel.app': 'Swap 50USDC for Weth on Arbitrum',
  'coingecko-ai.vercel.app': 'Current price of BTC',
  'near-safe-agent.vercel.app': 'Deploy a safe on Ethereum mainnet',
  'near-uniswap-agent.vercel.app': 'Send 0.5ETH',
};

export default function AgentRow({ agentData }: { agentData: RegistryData[] }) {
  const router = useRouter();

  useEffect(() => {
    // Prefetch the /chat route to make navigation faster
    router.prefetch('/chat');
  }, [router]);

  return (
    <section className='relative mt-7'>
      <div className='flex md:items-center md:justify-center overflow-x-auto space-x-6 disable-scrollbars -mx-8 md:-mx-0 pl-6 md:pl-0'>
        {agentData?.map((agent) => (
          <Card
            key={agent.id}
            className='flex-shrink-0 flex flex-col min-w-[306px] min-h-[125px] p-4 bg-[#18181A] border-none hover:bg-black/50 transition-colors cursor-pointer'
            onClick={() =>
              router.replace(
                `/chat?agentid=${agent.id}&prompt=${actionTexts[agent.id]}`
              )
            }
          >
            <div className='flex items-start gap-3 mb-4'>
              <div className='relative w-12 h-12 rounded-md overflow-hidden'>
                <Image
                  src={agent.image || '/placeholder.svg'}
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
                        <TooltipProvider
                          key={`${agent.name}-${network.name}-${index}`}
                        >
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                key={`${agent.name}-${network.name}-${index}`}
                                className='relative w-5 h-5'
                              >
                                <Image
                                  src={network.icon}
                                  alt={`${network.name} icon`}
                                  fill
                                  className='object-contain rounded-md'
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>{network.name}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )
                    )}
                  </div>
                ) : null}
              </div>
            </div>

            <Link
              href={`/chat?agentid=${agent.id}&prompt=${actionTexts[agent.id]}`}
              className='flex items-center justify-start'
            >
              <Button
                size='sm'
                className='bg-[#60A5FA4D] hover:bg-[#60A5FA]/40 text-[#60A5FA] text-sm h-8'
              >
                <span className='flex items-center gap-1'>
                  {actionTexts[agent.id]}
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
