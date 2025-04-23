import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';

export interface SocialAccount {
  provider: string;
  username: string;
  profileUrl?: string;
}

export function useNextAuthSocialConnections() {
  const { data: session, status } = useSession();
  const [connectedAccounts, setConnectedAccounts] = useState<SocialAccount[]>(
    []
  );
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isDisconnecting, setIsDisconnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch connected accounts when session changes
  useEffect(() => {
    const fetchConnectedAccounts = async () => {
      if (status !== 'authenticated') return;

      try {
        const response = await fetch('/api/settings/socials');
        if (response.ok) {
          const data = await response.json();
          setConnectedAccounts(data.accounts || []);
        }
      } catch (error) {
        console.error('Failed to fetch connected accounts:', error);
      }
    };

    fetchConnectedAccounts();
  }, [status, session]);

  const connectSocialAccount = async (provider: string) => {
    setIsConnecting(true);
    setError(null);

    try {
      // With NextAuth, this will redirect to the provider's OAuth page
      await signIn(provider, {
        callbackUrl: '/settings',
        redirect: true,
      });

      // No need to handle the response as user will be redirected
    } catch (err) {
      setError(
        err instanceof Error ? err.message : `Failed to connect ${provider}`
      );
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
    session,
    status,
  };
}
