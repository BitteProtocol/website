export interface WalletConnectionState {
  isEvmConnected: boolean;
  isNearConnected: boolean;
  isSuiConnected: boolean;
  evmAddress?: string;
  nearAddress?: string;
  suiAddress?: string;
  lastUpdated: string;
}

export interface WalletConnectionResponse {
  success: boolean;
  state: WalletConnectionState;
  error?: string;
}
