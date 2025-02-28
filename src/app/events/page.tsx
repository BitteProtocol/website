import { EventsUI } from '@/components/layout/Events';
import { MB_URL } from '@/lib/url';
import { Metadata } from 'next';

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
  return (
    <main className='flex flex-col items-center justify-between'>
      <EventsUI />
    </main>
  );
}
