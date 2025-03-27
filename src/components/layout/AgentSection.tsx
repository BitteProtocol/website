import { VerifiedAgentData } from '@/lib/types/agent.types';
import { MB_URL } from '@/lib/url';
import { useBitteWallet } from '@bitte-ai/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import AgentImage from './AgentImage';

export const AgentSection = ({
  agentData,
}: {
  agentData: VerifiedAgentData;
}) => {
  const scrollContainerRef1 = useRef<HTMLDivElement>(null);
  const scrollContainerRef2 = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const { isConnected: isNearConnected } = useBitteWallet();
  const { isConnected } = useAccount();

  useEffect(() => {
    const scrollStep = (
      scrollContainer: HTMLDivElement | null,
      direction: 'left' | 'right'
    ) => {
      if (scrollContainer) {
        const scrollAmount = 1;
        if (direction === 'right') {
          if (
            scrollContainer.scrollLeft >=
            scrollContainer.scrollWidth - scrollContainer.clientWidth
          ) {
            scrollContainer.scrollLeft = 0;
          } else {
            scrollContainer.scrollLeft += scrollAmount;
          }
        } else {
          if (scrollContainer.scrollLeft <= 0) {
            scrollContainer.scrollLeft =
              scrollContainer.scrollWidth - scrollContainer.clientWidth;
          } else {
            scrollContainer.scrollLeft -= scrollAmount;
          }
        }
      }
    };

    const step = () => {
      scrollStep(scrollContainerRef1.current, 'right');
      scrollStep(scrollContainerRef2.current, 'left');
      window.requestAnimationFrame(step);
    };

    window.requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    // Prefetch the /chat route to make navigation faster
    router.prefetch('/chat');
  }, [router]);

  const goToAgent = (agentId: string, message: string) => {
    const encodedPrompt = encodeURIComponent(message);
    let url = `/chat?agentid=${agentId}`;
    if (isConnected || isNearConnected) {
      url += `&prompt=${encodedPrompt}`;
    }
    router.replace(url);
  };

  if (!agentData) {
    return <></>;
  }

  return (
    <section className='relative mb-12'>
      <div className='absolute left-0 top-0 bottom-0 w-16 pointer-events-none bg-gradient-to-r from-black to-transparent z-10'></div>
      <div className='absolute right-0 top-0 bottom-0 w-16 pointer-events-none bg-gradient-to-l from-black to-transparent z-10'></div>
      <div
        className='flex items-center gap-3 max-w-[100vw] overflow-x-auto overflow-y-hidden disable-scrollbars mb-3'
        ref={scrollContainerRef1}
        style={{ scrollBehavior: 'auto' }}
      >
        {agentData.agents?.map((data, i) => (
          <Card
            key={`agents-${i}`}
            className='min-w-[307px] h-[76px] flex items-center bg-[#18181A] cursor-pointer border-zinc-800 hover:border-mb-purple-70 hover:shadow-custom'
            onClick={() => goToAgent(data.id, 'Hey, what can you do for me?')}
          >
            <CardContent className='text-center p-3 flex items-center gap-3'>
              <div>
                {data?.image && (
                  <AgentImage
                    src={data?.image}
                    className='object-contain max-h-[56px] max-w-[160px] min-h-[40px]'
                    width={56}
                    height={56}
                    alt={`${data?.id}-logo`}
                    loading='lazy'
                  />
                )}
              </div>
              <div className='font-medium text-mb-white-50'>{data?.name}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div
        className='flex items-center gap-3 max-w-[100vw] overflow-x-auto overflow-y-hidden disable-scrollbars'
        ref={scrollContainerRef2}
        style={{ scrollBehavior: 'auto', paddingLeft: '50px' }}
      >
        {agentData?.agents
          ?.slice()
          .reverse()
          .map((data, i) => (
            <Card
              key={`agents-${i}`}
              className='min-w-[307px] h-[76px] flex items-center bg-[#18181A] border-zinc-800 cursor-pointer hover:border-mb-purple-70 hover:shadow-custom'
              onClick={() => goToAgent(data.id, 'Hey, what can you do for me?')}
            >
              <CardContent className='text-center p-3 flex items-center gap-3'>
                <div>
                  {data?.image && (
                    <AgentImage
                      src={data?.image}
                      className='object-contain max-h-[56px] max-w-[160px] min-h-[40px]'
                      width={56}
                      height={56}
                      alt={`${data?.id}-logo`}
                      loading='lazy'
                    />
                  )}
                </div>
                <div className='font-medium text-mb-white-50'>{data?.name}</div>
              </CardContent>
            </Card>
          ))}
      </div>
      <div className='mt-16 md:mt-10 flex items-center justify-center gap-3 md:gap-6'>
        <Link href='/agents'>
          <Button variant='default' className='w-[136px] md:w-[200px]'>
            Browse Agents
          </Button>
        </Link>
        <Button asChild variant='secondary' className='w-[136px] md:w-[200px]'>
          <Link href={MB_URL.DEV_DOCS} target='_blank'>
            Build Chain Agent
          </Link>
        </Button>
      </div>
    </section>
  );
};
