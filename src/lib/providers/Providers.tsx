'use client';

import ContextProvider from '@/context';
import {
  BitteWalletContextProvider,
  WalletModuleFactory,
} from '@bitte-ai/react';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';

const BitteWalletSetup = {
  network: 'mainnet',
  callbackUrl: typeof window !== 'undefined' ? window.location.origin : '',
  contractAddress: '',
  walletUrl: 'https://mintbase-wallet-hzimsr3cc-bitteprotocol.vercel.app/',
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
