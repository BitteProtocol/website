import { useState, useEffect, useCallback, useRef } from 'react';
import { signIn, useSession } from 'next-auth/react';

export interface SocialAccount {
  provider: string;
  username: string;
  profileUrl?: string;
}

// Extended session user type with our custom properties
interface ExtendedUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id: string; // Required
  username?: string;
  provider?: string;
}

/**
 * Hook to get and manage social connections across auth providers
 */
export const useNextAuthSocialConnections = () => {
  const { data: sessionData, status } = useSession();
  const session = sessionData as unknown as { user: ExtendedUser } | null;

  const [loading, setLoading] = useState(true);
  const [connectedAccounts, setConnectedAccounts] = useState<SocialAccount[]>(
    []
  );
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isDisconnecting, setIsDisconnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Keep track of the last connection request
  const connectingProviderRef = useRef<string | null>(null);

  // Load connections from the server API
  const loadConnections = useCallback(async () => {
    if (status !== 'authenticated' || !session?.user) {
      setConnectedAccounts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Loading social connections...');
      const response = await fetch('/api/settings/socials');

      if (response.ok) {
        const data = await response.json();
        console.log('Social connections loaded:', data.accounts);
        setConnectedAccounts(data.accounts || []);
      } else {
        console.error(
          'Failed to fetch social connections:',
          response.statusText
        );
        setConnectedAccounts([]);
      }
    } catch (error) {
      console.error('Error fetching social connections:', error);
      setConnectedAccounts([]);
    } finally {
      setLoading(false);
      connectingProviderRef.current = null; // Reset the connecting provider
    }
  }, [status, session]);

  // Initial load of connections when session becomes authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      loadConnections();
    } else if (status === 'unauthenticated') {
      setConnectedAccounts([]);
      setLoading(false);
    }
  }, [status, loadConnections]);

  // Reload connections when we connect to a new provider
  useEffect(() => {
    // If we have a provider that we're connecting to and our session includes that provider
    if (
      connectingProviderRef.current &&
      status === 'authenticated' &&
      session?.user?.provider === connectingProviderRef.current
    ) {
      loadConnections();
    }
  }, [status, session, loadConnections]);

  // Debug logging
  useEffect(() => {
    console.debug('Session status:', status);
    console.debug('Connected Accounts:', connectedAccounts);
    console.debug('Current provider:', session?.user?.provider);
  }, [connectedAccounts, session, status]);

  const connectSocialAccount = async (provider: string) => {
    setIsConnecting(true);
    setError(null);
    connectingProviderRef.current = provider; // Remember which provider we're connecting

    try {
      console.log(`Initiating sign in with ${provider}...`);
      await signIn(provider, {
        callbackUrl: '/settings',
        redirect: true,
      });
      // The page will redirect, no need to handle response here
    } catch (err) {
      setError(
        err instanceof Error ? err.message : `Failed to connect ${provider}`
      );
      setIsConnecting(false);
      connectingProviderRef.current = null;
    }
  };

  const disconnectSocialAccount = async (provider: string) => {
    setIsDisconnecting(true);
    setError(null);

    try {
      console.log(`Disconnecting ${provider}...`);
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

      // Refresh connections after disconnect
      await loadConnections();
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
    loading,
  };
};
