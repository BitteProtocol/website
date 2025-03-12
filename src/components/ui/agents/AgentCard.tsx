import AgentImage from '@/components/layout/AgentImage';
import { Badge } from '@/components/ui/badge';
import { RegistryData } from '@/lib/types/agent.types';
import { getCoverImageUrl, getRunAgentUrl } from '@/lib/utils/agent';
import { shortenString } from '@/lib/utils/strings';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarImage } from '../avatar';
import { Button } from '../button';

const AgentCard = ({ agent }: { agent: RegistryData }): JSX.Element | null => {
  const goToAgentDetail = (message: string) => {
    const encodedPrompt = encodeURIComponent(message);
    return `/agents/${agent.id}?prompt=${encodedPrompt}`;
  };

  if (!agent) return null;

  const coverImage = getCoverImageUrl(agent.image);
  const runAgentUrl = getRunAgentUrl(agent.id, agent.verified);

  return (
    <div className='rounded-md cursor-pointer bg-gradient-to-b from-mb-gray-750 to-mb-gray-650 p-[1px] h-fit w-full hover:bg-mb-gray-450 transition-all duration-500'>
      <Link href={goToAgentDetail('Hey, what can you do for me?')}>
        <div className='bg-mb-gray-900 p-6 rounded-md hover:bg-mb-gray-1000 transition-all duration-500'>
          <div className='flex flex-col gap-4'>
            <div className='flex justify-between items-center text-white'>
              <div className='flex items-center gap-4 flex-1'>
                <div className='h-[64px] w-[64px] relative'>
                  <AgentImage
                    alt={agent.name}
                    src={coverImage}
                    fill={true}
                    className='rounded-sm'
                  />
                </div>
                <div className='flex-1'>
                  <div className='font-semibold text-[18px] md:text-[20px]'>
                    {agent?.name}
                  </div>
                  <div className='text-mb-gray-400 lg:hidden text-[14px]'>
                    By {agent?.accountId}
                  </div>
                </div>
              </div>
              <div className='hidden lg:flex items-center gap-4'>
                <Link href={runAgentUrl} className='w-full'>
                  <Button variant='secondary'>Run Agent</Button>
                </Link>
              </div>
            </div>

            <div className='h-[64px] md:h-[54px]'>
              <div className='text-mb-gray-200 line-clamp-5 text-[14px]'>
                <div className='hidden md:block'>
                  {shortenString(agent?.description || '')}{' '}
                </div>
                <div className='md:hidden'>
                  {shortenString(agent?.description || '', 120)}
                </div>
              </div>
            </div>
            <div className='text-mb-gray-200 text-[14px] flex justify-between items-center mt-2'>
              <div className='flex justify-between items-center w-full flex-wrap gap-4'>
                <div className='hidden lg:flex'>
                  By
                  <Avatar className='bg-mb-gray-700 p-[2px] h-6 w-6 ml-2 mr-0.5'>
                    <AvatarImage src='/logo.svg' alt='bitte' />
                  </Avatar>
                  <span className='mr-3'>{agent?.accountId}</span>
                </div>
                <div className='lg:hidden'>
                  <Link
                    className={
                      agent?.id === 'simple-token-drop' ? 'hidden' : ''
                    }
                    href={runAgentUrl}
                  >
                    <Button variant='secondary'>Run Agent</Button>
                  </Link>
                </div>
                <div className='flex gap-2'>
                  {agent.category && (
                    <Badge
                      variant='pill'
                      className='bg-mb-gray-700 rounded-full'
                    >
                      {agent.category}
                    </Badge>
                  )}
                  {agent.verified ? (
                    <Badge
                      variant='pill'
                      className='bg-[#22C55E33] text-[#22C55E] flex items-center gap-1 rounded-full'
                    >
                      <CheckCircle2 className='w-3 h-3' />
                      Verified
                    </Badge>
                  ) : (
                    <Badge
                      variant='pill'
                      className='bg-[#C084FC33] text-[#C084FC] rounded-full'
                    >
                      Playground
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AgentCard;
