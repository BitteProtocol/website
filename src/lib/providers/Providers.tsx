'use client';

import { wagmiConfig } from '@/config/wagmit-config';
import ContextProvider from '@/context';
import { BitteWalletContextProvider } from '@mintbase-js/react';
import { WagmiProvider } from 'wagmi';

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
    <WagmiProvider config={wagmiConfig}>
      <BitteWalletContextProvider {...BitteWalletSetup} onlyBitteWallet={true}>
        <ContextProvider cookies={cookies}>{children}</ContextProvider>
      </BitteWalletContextProvider>
    </WagmiProvider>
  );
};

export default Providers;
