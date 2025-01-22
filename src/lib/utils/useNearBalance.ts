import { getBalance } from '@mintbase-js/rpc';
import { useEffect, useState } from 'react';

export const useNearBalance = (accountId: string) => {
  const [balance, setBalance] = useState<bigint | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (accountId) {
        try {
          const balanceData = await getBalance({
            accountId,
            rpcUrl: 'https://free.rpc.fastnear.com',
          });
          setBalance(balanceData);
        } catch (error) {
          console.error('Failed to fetch balance:', error);
        }
      }
    };

    fetchBalance();
  }, [accountId]);

  return balance;
};
