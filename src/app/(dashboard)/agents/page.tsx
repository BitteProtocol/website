import AgentContent from '@/components/layout/AgentsContent';
import { Skeleton } from '@/components/ui/skeleton';
import { getAssistants } from '@/lib/api/ai-registry/registry';
import { Suspense } from 'react';

export default async function Agents() {
  const data = await getAssistants();

  if (!data) {
    return null;
  }

  return (
    <Suspense
      fallback={
        <div className='flex gap-3'>
          <Skeleton className='w-1/3 h-[70vh]' />
          <Skeleton className='w-2/3 h-[70vh]' />
        </div>
      }
    >
      <AgentContent data={data} />
    </Suspense>
  );
}
