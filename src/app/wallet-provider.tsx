'use client';
import { BitteWalletContextProvider } from '@mintbase-js/react';

const BitteWalletSetup = {
  network: 'mainnet',
  callbackUrl: typeof window !== 'undefined' ? window.location.origin : '',
  contractAddress: '',
};

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <BitteWalletContextProvider {...BitteWalletSetup} onlyBitteWallet={true}>
      {children}
    </BitteWalletContextProvider>
  );
}
