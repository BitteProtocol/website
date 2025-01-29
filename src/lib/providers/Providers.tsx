'use client';

import ContextProvider from '@/context';
import { BitteWalletContextProvider } from '@mintbase-js/react';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';

const BitteWalletSetup = {
  network: 'mainnet',
  callbackUrl: typeof window !== 'undefined' ? window.location.origin : '',
  contractAddress: '',
};

type ProvidersProps = {
  children: React.ReactNode;
  cookies: string | null;
};

const Providers: React.FC<ProvidersProps> = ({ children, cookies }) => {
  return (
    <BitteWalletContextProvider
      {...BitteWalletSetup}
      additionalWallets={[setupMeteorWallet()]}
    >
      <ContextProvider cookies={cookies}>{children}</ContextProvider>
    </BitteWalletContextProvider>
  );
};

export default Providers;
