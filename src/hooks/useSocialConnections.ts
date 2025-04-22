import { useState, useEffect } from 'react';

export interface SocialAccount {
  provider: string;
  username: string;
  profileUrl?: string;
}

export function useSocialConnections() {
  const [connectedAccounts, setConnectedAccounts] = useState<SocialAccount[]>(
    []
  );
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isDisconnecting, setIsDisconnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // In a real implementation, you would fetch the user's connected accounts on load
  // useEffect(() => {
  //   const fetchConnectedAccounts = async () => {
  //     try {
  //       const response = await fetch('/api/settings/socials');
  //       if (response.ok) {
  //         const data = await response.json();
  //         setConnectedAccounts(data.accounts || []);
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch connected accounts:', error);
  //     }
  //   };
  //
  //   fetchConnectedAccounts();
  // }, []);

  const connectSocialAccount = async (provider: string) => {
    setIsConnecting(true);
    setError(null);

    try {
      // In a real implementation, this would redirect to OAuth flow
      // For now, we'll just simulate a connection by calling our API directly

      // Mock auth details that would come from OAuth
      const mockAuthDetails = {
        provider,
        username: provider === 'github' ? '@MARCELOKUNZE' : '@user',
        profileUrl:
          provider === 'github'
            ? 'https://github.com/MARCELOKUNZE'
            : 'https://twitter.com/user',
      };

      // Call API to save connection
      const response = await fetch('/api/settings/socials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          accountDetails: mockAuthDetails,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to connect ${provider}`);
      }

      // Add the connected account to our state
      setConnectedAccounts((prev) => {
        const exists = prev.some((acc) => acc.provider === provider);
        if (exists) return prev;
        return [...prev, mockAuthDetails];
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : `Failed to connect ${provider}`
      );
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectSocialAccount = async (provider: string) => {
    setIsDisconnecting(true);
    setError(null);

    try {
      // Call API to remove connection
      const response = await fetch(
        `/api/settings/socials?provider=${provider}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to disconnect ${provider}`);
      }

      // Remove the account from our state
      setConnectedAccounts((prev) =>
        prev.filter((account) => account.provider !== provider)
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : `Failed to disconnect ${provider}`
      );
    } finally {
      setIsDisconnecting(false);
    }
  };

  const isConnected = (provider: string) => {
    return connectedAccounts.some((account) => account.provider === provider);
  };

  const getAccount = (provider: string) => {
    return connectedAccounts.find((account) => account.provider === provider);
  };

  return {
    connectedAccounts,
    isConnecting,
    isDisconnecting,
    error,
    connectSocialAccount,
    disconnectSocialAccount,
    isConnected,
    getAccount,
  };
}
