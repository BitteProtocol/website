import { getBitteTokenBalances } from '@/lib/balances/bitteTokens';
import { formatTokenBalance } from '@/lib/utils/delegatedagents';
import { useEffect, useState } from 'react';
import { Chain } from 'viem';

interface FormattedTokenBalance {
  balance: string;
}

interface Balances {
  bitte: FormattedTokenBalance;
  dBitte: FormattedTokenBalance;
  sBitte: FormattedTokenBalance;
}

interface UseTokenBalancesResult {
  balances: Balances | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch BITTE token balances
 * @param chain The blockchain chain to use
 * @param address The wallet address to check balances for
 * @returns Object containing balances, loading state, error state, and refetch function
 */
export function useBitteTokenBalances(
  chain: Chain | undefined,
  address: `0x${string}` | undefined
): UseTokenBalancesResult {
  const [balances, setBalances] = useState<Balances | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Function to fetch balances
  const fetchBalances = async () => {
    if (!chain || !address) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await getBitteTokenBalances(chain, address);
      const formattedResult = {
        bitte: {
          balance: formatTokenBalance(
            result.bitte.amount,
            result.bitte.decimals,
            result.bitte.symbol
          ),
        },
        dBitte: {
          balance: formatTokenBalance(
            result.dBitte.amount,
            result.dBitte.decimals,
            result.dBitte.symbol
          ),
        },
        sBitte: {
          balance: formatTokenBalance(
            result.sBitte.amount,
            result.sBitte.decimals,
            result.sBitte.symbol
          ),
        },
      };

      setBalances(formattedResult);
    } catch (err) {
      console.error('Error fetching token balances:', err);
      setError(
        err instanceof Error ? err : new Error('Failed to fetch balances')
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch balances when dependencies change
  useEffect(() => {
    fetchBalances();
  }, [chain, address]);

  // Return hook data
  return {
    balances,
    isLoading,
    error,
    refetch: fetchBalances,
  };
}
