import {
  dropCardData,
  newsCardData,
  videosCardData,
} from '@/lib/data/exampleCardData';
import { productCardsData } from '@/lib/data/productCardsData';
import { MB_URL } from '@/lib/url';
import { ProductCardsSection } from './ProductCardsSection';
import { SupportedChainsSection } from './SupportedChainsSection';
import TextSection from './TextSection';

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

const AgentSection = dynamic(() => import('./AgentSection'));

const MpcSection = dynamic(() => import('./MpcSection'));

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
  subHeader: "It's actually incredibly easy with smart contracts.",
  factTitle: '',
  fact: '',
  btnTitle: 'Try Now',
  btnUrl: MB_URL.CHAT,
  isDisabled: false,
};

export const HomeComponent = () => {
  return (
    <>
      <SupportedChainsSection />
      <TextSection {...headerTextSection} />
      <AgentSection />
      <ProductCardsSection data={productCardsData} />
      <MpcSection />
      <ExamplesSection data={dropCardData} isVideo={false} />
      <ExamplesSection data={newsCardData} isVideo={false} />
      <ExamplesSection data={videosCardData} isVideo={true} />
      <VideoSection {...crossSection} />
      <NumbersSection />
      <PartnersSection />
    </>
  );
};
