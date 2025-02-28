import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { RegistryData } from '@/lib/types/agent.types';
import { mapChainIdsToNetworks } from '@/lib/utils/chainIds';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function AgentRow({ agentData }: { agentData: RegistryData[] }) {
  return (
    <section className='relative w-screen mt-16 mb-12 overflow-hidden'>
      <div
        className='flex justify-center items-center gap-6'
      >
        {agentData?.map((agent) => (
          <Card
            key={agent.id}
            className='flex flex-col min-w-[280px] min-h-[125px] p-4 bg-[#18181A] border-none hover:bg-black/50 transition-colors cursor-pointer'
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
                      )
                    )}
                  </div>
                ) : null}
              </div>
            </div>

            <Link href={`/chat/`} className='mt-auto'>
              <Button
                variant='link'
                className='bg-[#60A5FA4D] hover:bg-[#60A5FA]/40 text-[#60A5FA] w-full'
              >
                Open App
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}
