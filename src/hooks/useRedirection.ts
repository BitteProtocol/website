import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBitteWallet } from '@bitte-ai/react';
import { useAccount } from 'wagmi';
import { usePathname } from 'next/navigation';

export const useRedirection = () => {
  const { isConnected: isNearConnected } = useBitteWallet();
  const { isConnected, isConnecting } = useAccount();
  const router = useRouter();
  const pathname = usePathname();

  const [hasRedirected, setHasRedirected] = useState<boolean>(
    localStorage.getItem('hasRedirected') === 'true'
  );

  useEffect(() => {
    const redirected = localStorage.getItem('hasRedirected') === 'true';
    const checkAndRedirect = () => {
      if (
        (isConnected || isNearConnected) &&
        !pathname.includes('/chat') &&
        pathname === '/' &&
        !redirected &&
        !isConnecting
      ) {
        router.replace('/chat');
        localStorage.setItem('hasRedirected', 'true');
        setHasRedirected(true);
      }
    };

    checkAndRedirect();
  }, [isConnected, isNearConnected, pathname, router, isConnecting]);

  useEffect(() => {
    if (!isConnected && !isNearConnected && !isConnecting && pathname === '/') {
      // Delay the removal of the redirection flag to allow state stabilization
      const timeoutId = setTimeout(() => {
        localStorage.removeItem('hasRedirected');
        setHasRedirected(false);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [isConnected, isNearConnected, isConnecting, pathname]);
};
