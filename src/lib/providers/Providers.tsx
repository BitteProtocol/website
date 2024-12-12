'use client';

import { BitteWalletContextProvider } from '@mintbase-js/react';

const BitteWalletSetup = {
  network: 'mainnet',
  callbackUrl: typeof window !== 'undefined' ? window.location.origin : '',
  contractAddress: '',
};

type ProvidersProps = {
  children: React.ReactNode;
};

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <BitteWalletContextProvider {...BitteWalletSetup} onlyBitteWallet={true}>
      {children}
    </BitteWalletContextProvider>
  );
};

export default Providers;
