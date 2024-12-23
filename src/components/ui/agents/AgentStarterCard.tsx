'use client';

import { Card, CardContent } from '../card';
import { ArrowRightCircle } from 'lucide-react';

export const AgentStarterCard = (): JSX.Element => {
  return (
    <Card className='border border-[#CAFFF280] w-full md:w-[402px]'>
      <CardContent className='p-4 flex items-center justify-between'>
        <div>
          <p className='text-[#CAFFF2] text-lg font-bold mb-1.5'>
            Agent Starter
          </p>
          <p className='text-[#CBD5E1]'>
            Create your own AI Agents in minutes.
          </p>
        </div>
        <ArrowRightCircle size={32} className='' color='#CAFFF2' />
      </CardContent>
    </Card>
  );
};
