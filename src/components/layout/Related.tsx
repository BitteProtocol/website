'use client';

import { RegistryData } from '@/lib/types/agent.types';
import Link from 'next/link';
import TemplateCard from '../ui/agents/AgentCard';
import { Button } from '../ui/button';

export const RelatedTemplates = ({
  relatedAgents,
}: {
  relatedAgents: RegistryData[];
}) => {
  return relatedAgents ? (
    <div className='w-full mt-10'>
      <h1 className='text-xl md:text-2xl font-semibold text-[#CBD5E1]'>
        Related
      </h1>
      <div className='flex flex-wrap md:flex-nowrap w-full gap-8 mt-10'>
        {relatedAgents?.map((agent) => (
          <TemplateCard key={agent.id} agent={agent} />
        ))}
      </div>
      <div className='w-full flex justify-center p-20'>
        <Link href='/agents'>
          <Button variant='secondary' className='w-[200px]'>
            View All Agents
          </Button>
        </Link>
      </div>
    </div>
  ) : null;
};
