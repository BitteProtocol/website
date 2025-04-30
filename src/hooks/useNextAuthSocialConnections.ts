import { useState, useEffect, useCallback } from 'react';
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
  id?: string;
  username?: string;
  provider?: string;
}

// LOCAL STORAGE APPROACH WITH CONSISTENT USER ID
// We use a combination of available identifiers to create a consistent ID across providers
const STORAGE_KEY = 'bitte_social_connections';

export function useNextAuthSocialConnections() {
  const { data: session, status } = useSession();
  const [connectedAccounts, setConnectedAccounts] = useState<SocialAccount[]>(
    []
  );
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isDisconnecting, setIsDisconnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [masterUserId, setMasterUserId] = useState<string>('');

  // Get the user with extended properties
  const user = session?.user as ExtendedUser | undefined;

  // Determine a consistent user identifier across providers
  useEffect(() => {
    if (status === 'authenticated' && user) {
      // Create a master ID from available information
      let userId = '';

      // Try to use email as the most reliable identifier
      if (user.email) {
        userId = `email:${user.email}`;
      }
      // Fall back to name if available
      else if (user.name) {
        userId = `name:${user.name}`;
      }
      // Last resort: use the current session ID
      else if (user.id) {
        userId = `session:${user.id}`;
      }

      // Store it for this session
      if (userId) {
        setMasterUserId(userId);

        // Also store it in localStorage for persistence
        localStorage.setItem('bitte_master_user_id', userId);
      }
    } else if (status === 'unauthenticated') {
      // Try to recover from localStorage if available
      const savedId = localStorage.getItem('bitte_master_user_id');
      if (savedId) {
        setMasterUserId(savedId);
      } else {
        setMasterUserId('');
      }
    }
  }, [status, user]);

  // Load connections from localStorage with the master user ID
  const loadConnections = useCallback(() => {
    if (!masterUserId || typeof window === 'undefined') return [];

    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (!savedData) return [];

      const allConnections = JSON.parse(savedData);
      return allConnections[masterUserId] || [];
    } catch (error) {
      console.error('Failed to load connections from localStorage:', error);
      return [];
    }
  }, [masterUserId]);

  // Save connections to localStorage with the master user ID
  const saveConnections = useCallback(
    (connections: SocialAccount[]) => {
      if (!masterUserId || typeof window === 'undefined') return;

      try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        const allConnections = savedData ? JSON.parse(savedData) : {};

        // Update connections for this master user ID
        allConnections[masterUserId] = connections;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(allConnections));
        setConnectedAccounts(connections);
      } catch (error) {
        console.error('Failed to save connections to localStorage:', error);
      }
    },
    [masterUserId]
  );

  // Check if we should add the current provider
  useEffect(() => {
    if (status === 'authenticated' && user && masterUserId) {
      // Access custom properties added by our NextAuth callbacks
      const currentProvider = user.provider;
      const currentUsername = user.username;

      if (currentProvider && currentUsername) {
        const connections = loadConnections();
        const isAlreadyConnected = connections.some(
          (conn: SocialAccount) => conn.provider === currentProvider
        );

        if (!isAlreadyConnected) {
          // Create new connection
          const profileUrl =
            currentProvider === 'github'
              ? `https://github.com/${currentUsername}`
              : currentProvider === 'twitter'
                ? `https://twitter.com/${currentUsername}`
                : undefined;

          const newConnection: SocialAccount = {
            provider: currentProvider,
            username: currentUsername,
            profileUrl,
          };

          // Add to existing connections
          const updatedConnections = [...connections, newConnection];
          saveConnections(updatedConnections);
        }

        // Always reset connecting state
        setIsConnecting(false);
      }
    }
  }, [status, user, masterUserId, loadConnections, saveConnections]);

  // Load initial connections when master user ID is ready
  useEffect(() => {
    if (masterUserId) {
      const connections = loadConnections();
      setConnectedAccounts(connections);
    } else {
      setConnectedAccounts([]);
    }
  }, [masterUserId, loadConnections]);

  // Show developer debug output
  useEffect(() => {
    console.debug('Master User ID:', masterUserId);
    console.debug('Connected Accounts:', connectedAccounts);
    console.debug('Session:', session);
  }, [masterUserId, connectedAccounts, session]);

  const connectSocialAccount = async (provider: string) => {
    setIsConnecting(true);
    setError(null);

    try {
      await signIn(provider, {
        callbackUrl: '/settings',
        redirect: true,
      });
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
      const connections = loadConnections();
      const updatedConnections = connections.filter(
        (account: SocialAccount) => account.provider !== provider
      );

      saveConnections(updatedConnections);
      setIsDisconnecting(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : `Failed to disconnect ${provider}`
      );
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
