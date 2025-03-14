'use client';

import ContextProvider from '@/context';
import {
  BitteWalletContextProvider,
  WalletModuleFactory,
} from '@/pkg/react';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';

const vercelENV = 'https://mintbase-wallet-hzimsr3cc-bitteprotocol.vercel.app/'
const localENV = 'http://mainnet.localhost:3000'

const BitteWalletSetup = {
  network: 'mainnet',
  callbackUrl: typeof window !== 'undefined' ? window.location.origin : '',
  contractAddress: '',
  walletUrl: localENV,
};

type ProvidersProps = {
  children: React.ReactNode;
  cookies: string | null;
};

const Providers: React.FC<ProvidersProps> = ({ children, cookies }) => {
  return (
    <BitteWalletContextProvider
      {...BitteWalletSetup}
      additionalWallets={[setupMeteorWallet() as WalletModuleFactory]}
    >
      <ContextProvider cookies={cookies}>{children}</ContextProvider>
    </BitteWalletContextProvider>
  );
};

export default Providers;
