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
import { Filters, RegistryData } from '@/lib/types/agent.types';
import VideoSection from './VideoSection';

export type AgentData = {
  agents: RegistryData[];
  unverifiedAgents: RegistryData[];
  filters: Filters[];
};

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

export const HomeComponent = ({ agentData }: { agentData: AgentData }) => {
  return (
    <>
      <SupportedChainsSection />
      <TextSection {...headerTextSection} />
      <AgentSection agentData={agentData} />
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
