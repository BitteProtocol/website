import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { RegistryData } from '@/lib/types/agent.types';
import { mapChainIdsToNetworks } from '@/lib/utils/chainIds';
import { useRef, useEffect } from 'react';

export default function AgentRow({ agents }: { agents: RegistryData[] }) {
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

  return (
    <section className='relative my-40'>
      <div className='absolute left-0 top-0 bottom-0 w-16 pointer-events-none bg-gradient-to-r from-black to-transparent z-10'></div>
      <div className='absolute right-0 top-0 bottom-0 w-16 pointer-events-none bg-gradient-to-l from-black to-transparent z-10'></div>
      <div
        className='flex itmes-center gap-6 max-w-[100vw] overflow-x-auto disable-scrollbars'
        ref={scrollContainerRef}
        style={{ scrollBehavior: 'auto' }}
      >
        {agents.map((agent) => (
          <Card
            key={agent.name}
            className='flex flex-col min-w-[280px] p-4 bg-black/40 backdrop-blur-sm border-gray-800 hover:bg-black/50 transition-colors cursor-pointer'
          >
            <div className='flex items-start gap-3'>
              <div className='relative w-10 h-10'>
                <Image
                  src={agent.coverImage || '/placeholder.svg'}
                  alt={`${agent.name} logo`}
                  fill
                  className='object-contain'
                />
              </div>
              <span className='text-lg font-medium text-white'>
                {agent.name}
              </span>
            </div>

            {agent.chainIds ? (
              <div className='flex gap-1 mt-3 mb-4'>
                {mapChainIdsToNetworks(agent.chainIds).map((network, index) => (
                  <div
                    key={`${agent.name}-${network.name}-${index}`}
                    className='relative w-5 h-5'
                  >
                    <Image
                      src={network.icon}
                      alt={`${network.name} icon`}
                      fill
                      className='object-contain rounded-full'
                    />
                  </div>
                ))}
              </div>
            ) : null}

            <span className='mt-auto text-sm text-blue-400 hover:text-blue-300 transition-colors'>
              {agent?.actionText} →
            </span>
          </Card>
        ))}
      </div>
    </section>
  );
}
