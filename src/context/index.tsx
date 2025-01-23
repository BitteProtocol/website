/* eslint-disable */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { type ReactNode } from 'react';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { coinbaseWallet, metaMask, walletConnect } from 'wagmi/connectors';

import {
  arbitrum,
  base,
  gnosis,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from 'wagmi/chains';

// Set up queryClient
const queryClient = new QueryClient();

/* export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID; */
export const walletConnectId =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

/* if (!projectId) {
  throw new Error('Project ID is not defined');
} */

if (!walletConnectId) {
  throw new Error('Wallet Connect ID is not defined');
}

/* const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [alchemyProvider({ apiKey: 'yourAlchemyApiKey' }), publicProvider()]
); */

const connectors =
  typeof window !== 'undefined'
    ? [
        metaMask(),
        coinbaseWallet({ appName: 'Bitte AI' }),
        walletConnect({ projectId: walletConnectId }),
      ]
    : [];

export const config = createConfig({
  chains: [mainnet, sepolia, arbitrum, base, polygon, optimism, gnosis],
  connectors,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [gnosis.id]: http(),
  },
});

function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  /*   const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  ); */

  return (
    <WagmiProvider config={config} /* initialState={initialState} */>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;
