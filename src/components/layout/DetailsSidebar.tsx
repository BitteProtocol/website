import { Button } from '@/components/ui/button';
import { RegistryData } from '@/lib/types/agent.types';
import { MB_URL } from '@/lib/url';
import { getCoverImageUrl, getRunAgentUrl } from '@/lib/utils/agent';
import Link from 'next/link';
import { ActionLink } from './ActionLink';
import AgentImage from './AgentImage';

export const DetailsSideBar = ({ agent }: { agent: RegistryData }) => {
  if (!agent) return null;

  const coverImage = getCoverImageUrl(agent.image);
  const runAgentUrl = getRunAgentUrl(agent.id, agent.verified);

  return (
    <aside className='sticky top-20'>
      <div className='flex w-full items-center gap-7'>
        <div className='w-[75px] h-[75px] relative aspect-square shrink-0'>
          <AgentImage
            alt={agent.name}
            src={coverImage}
            fill={true}
            className='rounded-sm'
          />
        </div>
        <h1 className='text-2xl md:text-3xl w-auto font-semibold'>
          {agent.name}
        </h1>
      </div>
      <div className='lg:hidden flex items-center gap-3 w-full mt-10'>
        {agent.repo ? (
          <Link
            className='w-full'
            href={agent.repo}
            target='_blank'
            rel='noreferrer'
          >
            <Button variant='secondary' className='w-full'>
              Fork Agent
            </Button>
          </Link>
        ) : null}
        <Link className='w-full' href={runAgentUrl}>
          <Button variant='default' className='w-full'>
            Run Agent
          </Button>
        </Link>
      </div>
      <div className='mt-10 md:my-10'>
        <ActionLink agent={agent} />
      </div>
      <div className='hidden lg:flex items-center gap-3 w-full'>
        <Link
          className='w-full'
          href={MB_URL.EMBED_DOCS}
          target='_blank'
          rel='noreferrer'
        >
          <Button variant='secondary' className='w-full'>
            Embed
          </Button>
        </Link>
        {agent.repo ? (
          <Link
            className='w-full'
            href={agent.repo}
            target='_blank'
            rel='noreferrer'
          >
            <Button variant='secondary' className='w-full'>
              Fork Agent
            </Button>
          </Link>
        ) : null}
        <Link className='w-full' href={runAgentUrl}>
          <Button variant='default' className='w-full'>
            Run Agent
          </Button>
        </Link>
      </div>
    </aside>
  );
};
