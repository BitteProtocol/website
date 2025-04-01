import { MB_URL } from '../url';

export const productCardsData = {
  title: 'EXPLORE OUR CORE PRODUCTS',
  cards: [
    {
      id: 1,
      badge: 'AI Wallet',
      title: 'Manage Crypto Assets and Build Transactions with AI',
      sub: 'No app install, non custodial, passkey powered and sponsored transactions. ',
      bg: '/examples/brain.webp',
      btn_text: 'Wallet',
      link: MB_URL.BITTE_WALLET,
    },
    {
      id: 2,
      badge: 'Agent Registry',
      title: 'Agent Registry',
      sub: 'Fork other agents to make them better or bootstrap your own.',
      bg: '/examples/registry.webp',
      btn_text: 'Agents',
      link: '/agents',
    },
  ],
};
