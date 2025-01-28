import { EventsUI } from '@/components/layout/Events';
import { getAssistants } from '@/lib/api/ai-registry/registry';
import { Suspense } from 'react';

export default async function Registry() {
  const data = await getAssistants();

  return (
    <main className='flex flex-col items-center justify-between'>
      <Suspense>{data ? <EventsUI /> : null}</Suspense>
    </main>
  );
}
