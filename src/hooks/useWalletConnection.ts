import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useBitteWallet } from '@bitte-ai/react';
import { useWallet as useSuiWallet } from '@suiet/wallet-kit';
import { WalletConnectionState } from '@/lib/types/wallet.types';

export const useWalletConnection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [serverState, setServerState] = useState<WalletConnectionState | null>(
    null
  );

  // Get wallet states from different providers
  const { address: evmAddress, isConnected: isEvmConnected } = useAccount();
  const { isConnected: isNearConnected, activeAccountId: nearAddress } =
    useBitteWallet();
  const { connected: isSuiConnected, account: suiAccount } = useSuiWallet();

  // Fetch initial state from server
  useEffect(() => {
    const fetchState = async () => {
      try {
        const response = await fetch('/api/wallet');
        const data = await response.json();
        if (data.success) {
          setServerState(data.state);
        }
      } catch (error) {
        console.error('Failed to fetch wallet state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchState();
  }, []);

  // Update server state when wallet connections change
  useEffect(() => {
    const updateState = async () => {
      const newState: WalletConnectionState = {
        isEvmConnected,
        isNearConnected,
        isSuiConnected,
        evmAddress,
        nearAddress: nearAddress || undefined,
        suiAddress: suiAccount?.address || undefined,
        lastUpdated: new Date().toISOString(),
      };

      try {
        const response = await fetch('/api/wallet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newState),
          credentials: 'include', // Ensure cookies are sent with the request
        });

        const data = await response.json();
        if (data.success) {
          setServerState(data.state);
        }
      } catch (error) {
        console.error('Failed to update wallet state:', error);
      }
    };

    // Update state immediately when any wallet connection changes
    updateState();
  }, [
    isEvmConnected,
    isNearConnected,
    isSuiConnected,
    evmAddress,
    nearAddress,
    suiAccount?.address,
  ]);

  return {
    isLoading,
    serverState,
    isEvmConnected,
    isNearConnected,
    isSuiConnected,
    evmAddress,
    nearAddress: nearAddress || undefined,
    suiAddress: suiAccount?.address || undefined,
  };
};
