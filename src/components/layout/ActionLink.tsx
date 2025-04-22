'use client';
import { trackAnalytics } from '@/lib/utils/analytics';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { buttonVariants } from '../ui/button';
import { Badge } from '@/components/ui/badge';
import { RegistryData } from '@/lib/types/agent.types';

export const ActionLink = ({ agent }: { agent: RegistryData }): JSX.Element => {
  const buttonCss = `flex p-0 repository-link ${buttonVariants({
    variant: 'link',
  })}`;

  const handleActionClick = (type: string) => {
    trackAnalytics(`Detail Page ${type}`, agent.name);
  };

  return (
    <ul>
      <li className='w-full flex mb-5 items-center'>
        <div className='text-mb-gray-200 text-sm'>Category</div>
        <div className='text-right text-sm text-mb-white-100 flex ml-auto gap-2'>
          <Badge variant='secondary' className='bg-mb-gray-700 rounded-full'>
            {agent?.category || 'Other'}
          </Badge>
          {agent.verified ? (
            <Badge
              variant='secondary'
              className='bg-mb-green-20 text-mb-green-100 flex items-center gap-1 rounded-full'
            >
              <CheckCircle2 className='w-3 h-3' />
              Verified
            </Badge>
          ) : (
            <Badge
              variant='secondary'
              className='bg-mb-purple-20 text-mb-purple rounded-full'
            >
              Playground
            </Badge>
          )}
        </div>
      </li>

      <li className='w-full flex mb-5 items-center'>
        <div className='text-mb-gray-200 text-sm'>Publisher</div>
        <div className='text-right text-sm ml-auto font-semibold truncate max-w-[120px] md:max-w-[200px]'>
          {agent.publisher || agent.accountId || 'Bitte'}
        </div>
      </li>

      <li className='w-full flex mb-5 items-center'>
        <div className='text-mb-gray-200 text-sm'>Id</div>
        <div className='text-right text-sm ml-auto font-semibold truncate max-w-[120px] md:max-w-[200px]'>
          {agent.id}
        </div>
      </li>

      <li className='w-full flex mb-5 items-center'>
        <div className='text-mb-gray-200 text-sm'>Repository</div>
        <div className='text-right text-mb-white-100 text-sm flex ml-auto gap-2'>
          {agent.repo ? (
            <Link
              href={agent.repo}
              target='_blank'
              className={buttonCss}
              onClick={() => handleActionClick('GitHub')}
            >
              GitHub
              <ArrowUpRight width={18} height={18} className='ml-2' />
            </Link>
          ) : (
            <Badge
              variant='secondary'
              className='bg-mb-red-20 text-mb-red-100 rounded-full'
            >
              Closed Source
            </Badge>
          )}
        </div>
      </li>
    </ul>
  );
};
