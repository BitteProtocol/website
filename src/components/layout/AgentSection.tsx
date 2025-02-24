import { MB_URL } from '@/lib/url';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { AgentData } from './Home';
import { useRouter } from 'next/navigation';

export const AgentSection = ({ agentData }: { agentData: AgentData }) => {
  const scrollContainerRef1 = useRef<HTMLDivElement>(null);
  const scrollContainerRef2 = useRef<HTMLDivElement>(null);

  const router = useRouter();

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

  const goToAgentDetail = (agentId: string, message: string) => {
    const encodedPrompt = encodeURIComponent(message);
    router.push(`agents/${agentId}?prompt=${encodedPrompt}`);
  };

  return (
    <section className='relative mb-12'>
      <div className='absolute left-0 top-0 bottom-0 w-16 pointer-events-none bg-gradient-to-r from-black to-transparent z-10'></div>
      <div className='absolute right-0 top-0 bottom-0 w-16 pointer-events-none bg-gradient-to-l from-black to-transparent z-10'></div>
      <div
        className='flex itmes-center gap-3 max-w-[100vw] overflow-x-auto disable-scrollbars mb-3'
        ref={scrollContainerRef1}
        style={{ scrollBehavior: 'auto' }}
      >
        {agentData.agents?.map((data, i) => (
          <Card
            key={`agents-${i}`}
            className='min-w-[307px] h-[76px] flex items-center bg-[#18181A] cursor-pointer border-zinc-800 hover:border-[#E087FFB2] hover:shadow-custom'
            onClick={() =>
              goToAgentDetail(data.id, 'Hey, what can you do for me?')
            }
          >
            <CardContent className='text-center p-3 flex items-center gap-3'>
              <div>
                <Image
                  src={data?.coverImage || '/bitte-symbol-black.svg'}
                  className={`object-contain max-h-[56px] max-w-[160px] min-h-[40px] ${!data?.coverImage ? 'bg-white' : ''}`}
                  width={56}
                  height={56}
                  alt={`${data?.id}-logo`}
                  loading='lazy'
                />
              </div>
              <div className='font-medium text-[#F8FAFC]'>{data?.name}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div
        className='flex itmes-center gap-3 max-w-[100vw] overflow-x-auto disable-scrollbars'
        ref={scrollContainerRef2}
        style={{ scrollBehavior: 'auto', paddingLeft: '50px' }}
      >
        {[...agentData.agents]?.reverse().map((data, i) => (
          <Card
            key={`agents-${i}`}
            className='min-w-[307px] h-[76px] flex items-center bg-[#18181A] border-zinc-800 cursor-pointer hover:border-[#E087FFB2] hover:shadow-custom'
            onClick={() =>
              goToAgentDetail(data.id, 'Hey, what can you do for me?')
            }
          >
            <CardContent className='text-center p-3 flex items-center gap-3'>
              <div>
                <Image
                  src={data?.coverImage || '/bitte-symbol-black.svg'}
                  className={`object-contain max-h-[56px] max-w-[160px] min-h-[40px] ${!data?.coverImage ? 'bg-white' : ''}`}
                  width={56}
                  height={56}
                  alt={`${data?.id}-logo`}
                  loading='lazy'
                />
              </div>
              <div className='font-medium text-[#F8FAFC]'>{data?.name}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className='mt-11 flex items-center justify-center gap-3 md:gap-6'>
        <Link href='/agents'>
          <Button variant='default' className='w-full md:w-[200px]'>
            Browse Agents
          </Button>
        </Link>
        <Button asChild variant='secondary' className='w-full md:w-[200px]'>
          <Link href={MB_URL.DEV_DOCS} target='_blank'>
            Build Chain Agent
          </Link>
        </Button>
      </div>
    </section>
  );
};
