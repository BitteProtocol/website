'use client';

import { Card, CardContent } from '../card';
import { ArrowRightCircle } from 'lucide-react';
import Link from 'next/link';

export const AgentStarterCard = (): JSX.Element => {
  return (
    <div className='w-full md:w-[402px]'>
      <Link href='/agents/agent-starter'>
        <Card className='border border-mb-teal-50 hover:bg-mb-dark-blue transition-all duration-500'>
          <CardContent className='p-4 flex items-center justify-between'>
            <div>
              <p className='text-mb-teal text-lg font-bold mb-1.5'>
                Agent Starter
              </p>
              <p className='text-mb-gray-300'>
                Create your own AI Agents in minutes.
              </p>
            </div>
            <ArrowRightCircle size={32} color='#CAFFF2' />
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};
