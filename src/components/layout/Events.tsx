'use client';

import { RegistryBanner } from './RegistryBanner';
import Image from 'next/image';
import { ProductCardsSection } from './ProductCardsSection';

export const productCardsData = {
  title: 'HACKATHONS LIVE NOW',
  cards: [
    {
      id: 1,
      badge: 'Hackathon',
      title: 'Safe Agent Hackathon',
      sub: 'Build an agent for any of the Safe Partners like Aave, Lido, Balancer ',
      bg: '/examples/safe.jpg',
      btn_text: 'See Bounty',
      link: '/events/safe',
    },
    {
      id: 2,
      badge: 'Hackathon',
      title: 'NEAR Hackathon',
      sub: 'Build NEAR dapp agents.',
      bg: '/examples/near.jpg',
      btn_text: 'Register Now',
      link: 'https://1t-agents.devpost.com/',
    },
  ],
};

export const EventsUI = () => {
  return (
    <div className='w-full flex flex-col'>
      <div className='hidden md:block absolute top-0 left-0 w-full -mt-24 lg:-mt-0 h-[320px] md:h-screen bg-no-repeat bg-right-top bg-right md:bg-[url("/registry_banner_new.svg")] z-0'></div>
      <Image
        src={'/registry_banner_mobile_new.svg'}
        className='block md:hidden w-full max-h-[300px] -mt-20 -ml-6 md:ml-0 scale-105 md:scale-125'
        alt='mobile-banner-logo'
        loading='lazy'
        width={100}
        height={80}
      />
      <div className='flex w-full flex-col p-24'>
        <RegistryBanner
          header='Events + Hackathons'
          subHeader='Build Chain Agents and earn bounties at some upcoming events for all the chains.'
        />
        <ProductCardsSection data={productCardsData} />
      </div>
    </div>
  );
};
