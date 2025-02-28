import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { VerifiedAgentData } from '@/lib/types/agent.types';
import { mapChainIdsToNetworks } from '@/lib/utils/chainIds';
import { useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function AgentRow({
  agentData,
}: {
  agentData: VerifiedAgentData;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      const scrollAmount = 1; // Adjust the speed of scrolling here
      const step = () => {
        if (
          scrollContainer.scrollLeft >=
          scrollContainer.scrollWidth - scrollContainer.clientWidth
        ) {
          // Reset scroll to the start
          scrollContainer.scrollLeft = 0;
        } else {
          // Move the scroll
          scrollContainer.scrollLeft += scrollAmount;
        }
        window.requestAnimationFrame(step);
      };

      window.requestAnimationFrame(step);
    }
  }, []);
  console.log('DATA ROW', agentData);

  return (
    <section className='relative my-20'>
      <div className='absolute left-0 top-0 bottom-0 w-16 pointer-events-none bg-gradient-to-r from-black to-transparent z-10'></div>
      <div className='absolute right-0 top-0 bottom-0 w-16 pointer-events-none bg-gradient-to-l from-black to-transparent z-10'></div>
      <div
        className='flex itmes-center gap-6 max-w-[100vw] overflow-x-auto disable-scrollbars'
        ref={scrollContainerRef}
        style={{ scrollBehavior: 'auto' }}
      >
        {agentData?.agents?.map((agent) => (
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
                <span className='text-base font-medium text-white'>
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
