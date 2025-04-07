'use client';

import ContextProvider from '@/context';
import {
  BitteWalletContextProvider,
  WalletModuleFactory,
} from '@bitte-ai/react';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';
import { WalletProvider as SuietWalletProvider } from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';

const BitteWalletSetup = {
  callbackUrl: typeof window !== 'undefined' ? window.location.origin : '',
};

type ProvidersProps = {
  children: React.ReactNode;
  cookies: string | null;
};

const Providers: React.FC<ProvidersProps> = ({ children, cookies }) => {
  return (
    <SuietWalletProvider autoConnect={true}>
      <BitteWalletContextProvider
        {...BitteWalletSetup}
        additionalWallets={[setupMeteorWallet() as WalletModuleFactory]}
      >
        <ContextProvider cookies={cookies}>{children}</ContextProvider>
      </BitteWalletContextProvider>
    </SuietWalletProvider>
  );
};

export default Providers;
