import { RegistryUI } from '@/components/layout/Registry';
import { getAssistants } from '@/lib/api/ai-registry/registry';
import { MB_URL } from '@/lib/url';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Multi-Chain AI Agents Registry | Bitte.ai',
  openGraph: {
    title: 'Multi-Chain AI Agents Registry |  Bitte.ai',
    description: 'Browse and run the latest blockchain AI Agents.',
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
    title: 'Multi-Chain AI Agents Registry | Bitte.ai',
    description: 'Browse and run the latest blockchain AI Agents.',
    siteId: '1467726470533754880',
    creator: 'Bitte',
    images: 'https://bitte.ai/thumbnail.png',
  },
  description: 'Browse and run the latest blockchain AI Agents.',
  metadataBase: new URL(MB_URL.APP_URL),
};

export default async function Registry() {
  const data = await getAssistants();

  return (
    <main className='flex flex-col items-center justify-between'>
      <Suspense>
        {data ? (
          <RegistryUI
            agents={data.agents}
            unverifiedAgents={data.unverifiedAgents}
            filters={data.filters}
          />
        ) : null}
      </Suspense>
    </main>
  );
}
