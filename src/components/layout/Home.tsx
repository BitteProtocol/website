'use client';

import { productCardsData } from '@/lib/data/productCardsData';
import TextSection from './TextSection';
import { ProductCardsSection } from './ProductCardsSection';
import { SupportedChainsSection } from './SupportedChainsSection';
import { MB_URL } from '@/lib/url';
import {
  dropCardData,
  newsCardData,
  videosCardData,
} from '@/lib/data/exampleCardData';
import { AgentSection } from './AgentSection';
import { useVerifiedAssistants } from '@/hooks/useAssistants';
import { Skeleton } from '../ui/skeleton';
import dynamic from 'next/dynamic';

const ExamplesSection = dynamic(() => import('./ExamplesSection'), {
  ssr: false,
});

const VideoSection = dynamic(() => import('./VideoSection'), {
  ssr: false,
});

const PartnersSection = dynamic(() => import('./PartnersSection'), {
  ssr: false,
});
const NumbersSection = dynamic(() => import('./NumbersSection'), {
  ssr: false,
});
const headerTextSection = {
  title: 'Chain Agents Live',
  subHeader: 'Explore existing agents or fork one to create your own.',
  factTitle: '',
  fact: '',
  isDisabled: false,
  noSpacing: true,
};

const crossSection = {
  thumb: '/examples/agents.webp',
  src: '/video/bitte-sub-natural-language.mp4',
  title: 'Natural Language will Create Most Transactions',
  subHeader: "It's actaully incredibly easy with smart contracts.",
  factTitle: '',
  fact: '',
  btnTitle: 'Try Now',
  btnUrl: MB_URL.CHAT,
  isDisabled: false,
};

export const HomeComponent = () => {
  const { verifiedAgents: agentData, loading } = useVerifiedAssistants();
  return (
    <>
      <SupportedChainsSection />
      <TextSection {...headerTextSection} />
      {agentData && agentData?.agents?.length > 0 ? (
        <AgentSection agentData={agentData} />
      ) : loading ? (
        <div className='mb-12'>
          <div className='flex gap-6 items-center justify-center mb-3'>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className='w-[305px] h-[75px]' />
            ))}
          </div>
          <div className='flex gap-6 items-center justify-center'>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className='w-[305px] h-[75px]' />
            ))}
          </div>
        </div>
      ) : null}
      <ProductCardsSection data={productCardsData} />

      <ExamplesSection data={dropCardData} isVideo={false} />
      <ExamplesSection data={newsCardData} isVideo={false} />
      <ExamplesSection data={videosCardData} isVideo={true} />

      <VideoSection {...crossSection} />

      <NumbersSection />
      <PartnersSection />
    </>
  );
};
