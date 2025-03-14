import { Network, SignedMessage } from '@near-wallet-selector/core';
import type { JsonRpcProvider } from 'near-api-js/lib/providers';

// Types
interface WalletMessage {
  status: 'success' | 'failure' | 'pending';
  transactionHashes?: string;
  error?: string;
  [key: string]: unknown;
  signedRequest?: SignedMessage;
  errorMessage?: string;
  errorCode?: string;
}

interface FunctionCallKey {
  privateKey: string;
  contractId: string;
  methods: Array<string>;
}

interface WalletResponseData extends WalletMessage {
  public_key?: string;
  account_id: string;
}

interface WalletState {
  signedAccountId: string;
  functionCallKey: FunctionCallKey | null;
}

interface WalletConfig {
  walletUrl: string;
  network: Network;
  provider: JsonRpcProvider;
}

export type { WalletConfig, WalletState, WalletResponseData, WalletMessage };
