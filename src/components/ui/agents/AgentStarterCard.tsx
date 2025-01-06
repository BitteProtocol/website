'use client';

import { Card, CardContent } from '../card';
import { ArrowRightCircle } from 'lucide-react';
import Link from 'next/link';

export const AgentStarterCard = (): JSX.Element => {
  return (
    <Link href='/registry/agent-starter'>
      <Card className='border border-[#CAFFF280] w-full md:w-[402px] hover:bg-[#17171F] transition-all duration-500'>
        <CardContent className='p-4 flex items-center justify-between'>
          <div>
            <p className='text-[#CAFFF2] text-lg font-bold mb-1.5'>
              Agent Starter
            </p>
            <p className='text-[#CBD5E1]'>
              Create your own AI Agents in minutes.
            </p>
          </div>
          <ArrowRightCircle size={32} color='#CAFFF2' />
        </CardContent>
      </Card>
    </Link>
  );
};
