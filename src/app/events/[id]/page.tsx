import { RegistryBanner } from '@/components/layout/RegistryBanner';
import { Button } from '@/components/ui/button';
import { MB_URL } from '@/lib/url';
import { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Safe + Bitte Hackaton | Bitte.ai',
  openGraph: {
    title: 'Safe + Bitte Hackaton | Bitte.ai',
    description: 'Bounty $5k USDC on NEAR',
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
    title: 'Safe + Bitte Hackaton | Bitte.ai',
    description: 'Bounty $5k USDC on NEAR',
    siteId: '1467726470533754880',
    creator: 'Bitte',
    images: 'https://bitte.ai/thumbnail.png',
  },
  description: 'Bounty $5k USDC on NEAR',
  metadataBase: new URL(MB_URL.APP_URL),
};

const events = {
  safe: {
    title: 'Safe + Bitte',
  },
};

export default async function AgentDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // const id = params.id as string;

  const { id } = await params;
  // @ts-ignore
  const event = events[id];

  return (
    <div className='container'>
      <RegistryBanner header={event.title} subHeader='Upcoming events' />
      <div className='flex flex-col w-full z-10 py-12 text-center md:text-start'>
        <span className='text-3xl md:text-4xl font-semibold mb-6'>
          Bounty $5k USDC on NEAR
        </span>
        <span className='text-base md:text-xl text-mb-gray-300 mb-9'>
          Develop a chain agent for any Safe App listed in the Safe tab under
          ‘Apps’ (Safe Ecosystem). Bitte Protocol currently offers two agents
          built on mainnet—COW Swap and Uniswap—available via the links below.
          These agents can be forked and used as a foundation to build others,
          such as Balancer, Aave, Lido, or 1inch.
        </span>
        <span className='text-base md:text-xl text-mb-gray-300 mb-9'>
          With chain abstraction, users can execute single-prompt transactions
          like ‘Swap 10 USDC for VIRTUAL on Base.’ Alternatively, you can bypass
          the chain abstraction system by connecting directly to MetaMask,
          providing flexibility while onboarding new users.
        </span>
        <span className='text-3xl md:text-4xl font-semibold mb-6'>
          Requirements
        </span>
        <span className='text-base md:text-xl text-mb-gray-300 mb-9'>
          A video overview of the agent-building transactions is required. The
          agent must be hosted to enable testing by the judges. Our team is
          available to assist with hosting if needed. Additionally, the agent
          must be open source.
        </span>

        <span className='text-base md:text-xl text-mb-gray-300 mb-9'>
          Fork one of these agents as a base to get started{' '}
          <a
            href='https://www.bitte.ai/agents/near-cow-agent.vercel.app'
            target='_blank'
          >
            Cow Swap
          </a>
        </span>
        <div className='mt-11 flex items-center justify-center gap-3 md:gap-6'>
          <Button asChild variant='secondary' className='w-full md:w-[200px]'>
            <Link
              href='https://www.bitte.ai/agents/near-cow-agent.vercel.app'
              target='_blank'
            >
              Cow Swap Agent
            </Link>
          </Button>
          <Button asChild variant='secondary' className='w-full md:w-[200px]'>
            <Link
              href='https://www.bitte.ai/agents/near-uniswap-agent.vercel.app'
              target='_blank'
            >
              Uniswap Agent
            </Link>
          </Button>
          <Button asChild variant='secondary' className='w-full md:w-[200px]'>
            <Link
              href='https://www.bitte.ai/agents/near-safe-agent.vercel.app'
              target='_blank'
            >
              Safe Agent
            </Link>
          </Button>
        </div>

        <div className='mt-11 flex items-center justify-center gap-3 md:gap-6'>
          <Link href='https://safe.global/ai' target='_blank'>
            <Button variant='default' className='w-full md:w-[200px]'>
              Register Now
            </Button>
          </Link>
          <Button asChild variant='secondary' className='w-full md:w-[200px]'>
            <Link href={MB_URL.DEV_DOCS} target='_blank'>
              Docs
            </Link>
          </Button>
        </div>

        <span className='text-base md:text-xl text-mb-gray-300 mb-9'></span>
      </div>
    </div>
  );
}
