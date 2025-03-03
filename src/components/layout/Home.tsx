'use client';

import { productCardsData } from '@/lib/data/productCardsData';
import { ExamplesSection } from './ExamplesSection';
import { NumbersSection } from './NumbersSection';
import { PartnersSection } from './PartnersSection';
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
import VideoSection from './VideoSection';
import { useVerifiedAssistants } from '@/hooks/useAssistants';
import { Skeleton } from '../ui/skeleton';

const headerTextSection = {
  title: 'Chain Agents Live',
  subHeader: 'Explore existing agents or fork one to create your own.',
  factTitle: '',
  fact: '',
  isDisabled: false,
  noSpacing: true,
};

const paymasterSection = {
  thumb: '/video/paymaster-thumb.jpg',
  src: '/video/paymaster.mp4',
  title: 'Paymaster',
  subHeader:
    'Fund gasless transactions for your community on any NEAR smart contract and enable or disable specific functions.',
  factTitle: 'Sponsored Relays',
  fact: '+250k',
  btnTitle: 'Sponsor Now',
  btnUrl: MB_URL.PAYMASTER,
  isDisabled: false,
};

const crossSection = {
  thumb: '/video/cross-thumb.jpg',
  src: '/video/cross-chain.mp4',
  title: 'Universal Accounts with Chain Abstraction',
  subHeader: "One account to rule them all, with ERC-4337 Safe's on EVMs.",
  factTitle: '',
  fact: '',
  btnTitle: 'Try Now',
  btnUrl: MB_URL.BITTE_WALLET,
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
      <VideoSection {...paymasterSection} />
      <PartnersSection />
    </>
  );
};
