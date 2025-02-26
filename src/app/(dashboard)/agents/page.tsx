import { getAssistants } from '@/lib/api/ai-registry/registry';
import AgentContent from '@/components/layout/AgentsContent';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default async function Agents() {
  const data = await getAssistants();
  console.log('AGENTS LENGTH', data.filters);

  if (!data) {
    return null;
  }

  return (
    <Suspense
      fallback={
        <div className='flex gap-3'>
          <Skeleton className='w-1/6 h-[100vh]' />
          <Skeleton className='w-1/6 h-[45vh] mt-20' />
          <Skeleton className='w-4/6 h-[100vh] mt-20' />
        </div>
      }
    >
      <AgentContent />
    </Suspense>
  );
}
