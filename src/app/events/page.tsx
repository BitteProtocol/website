import { EventsUI } from '@/components/layout/Events';
import { getAssistants } from '@/lib/api/ai-registry/registry';
import { MB_URL } from '@/lib/url';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Events + Hackathons| Bitte.ai',
  openGraph: {
    title: 'Events + Hackathons| Bitte.ai',
    description:
      'Build Chain Agents and earn bounties at some upcoming events for all the chains.',
    images: [
      {
        type: 'image/png',
        url: 'https://bitte.ai/thumbnail.png',
        width: '1200',
        height: '630',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Events + Hackathons| Bitte.ai',
    description:
      'Build Chain Agents and earn bounties at some upcoming events for all the chains.',
    siteId: '1467726470533754880',
    creator: 'Bitte',
    images: 'https://bitte.ai/thumbnail.png',
  },
  description:
    'Build Chain Agents and earn bounties at some upcoming events for all the chains.',
  metadataBase: new URL(MB_URL.APP_URL),
};

export default async function Registry() {
  const data = await getAssistants();

  return (
    <main className='flex flex-col items-center justify-between'>
      <Suspense>{data ? <EventsUI /> : null}</Suspense>
    </main>
  );
}
