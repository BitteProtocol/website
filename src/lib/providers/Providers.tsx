'use client';

import { BitteWalletContextProvider } from '@mintbase-js/react';
import ContextProvider from '@/context';

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
    <BitteWalletContextProvider {...BitteWalletSetup} onlyBitteWallet={true}>
      <ContextProvider cookies={cookies}>{children}</ContextProvider>
    </BitteWalletContextProvider>
  );
};

export default Providers;
