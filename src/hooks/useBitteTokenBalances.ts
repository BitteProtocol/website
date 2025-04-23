import { useEffect, useState } from 'react';
import { createPublicClient, formatUnits, http, parseAbi } from 'viem';
import { sepolia } from 'viem/chains'; // Change to your target chain

// Token addresses
const BITTE_TOKEN_ADDRESS = '0x7D505943c86246B7d5459AA23Fd6c174E3088412';
const DBITTE_TOKEN_ADDRESS = '0xc5020CC858dB41a77887dE1004E6A2C166c09175';
const SBITTE_TOKEN_ADDRESS = '0x5C4b5813Be000770C589E5Cc5A2e278af3bC294e';

// ABI fragment for ERC20 functions
const tokenAbi = parseAbi([
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
]);

// Configure client - change to appropriate network
const client = createPublicClient({
  chain: sepolia, // Change this to the appropriate chain
  transport: http(),
});

interface TokenBalance {
  balance: number;
  symbol: string;
  rawBalance: bigint;
  loading: boolean;
  error: Error | null;
}

interface TokenBalances {
  bitte: TokenBalance;
  dBitte: TokenBalance;
  sBitte: TokenBalance;
  refetch: () => Promise<void>;
}

export function useBitteTokenBalances(address?: string): TokenBalances {
  const [bitteBalance, setBitteBalance] = useState<TokenBalance>({
    balance: 0,
    symbol: 'BITTE',
    rawBalance: BigInt(0),
    loading: true,
    error: null,
  });

  const [dBitteBalance, setDBitteBalance] = useState<TokenBalance>({
    balance: 0,
    symbol: 'dBITTE',
    rawBalance: BigInt(0),
    loading: true,
    error: null,
  });

  const [sBitteBalance, setSBitteBalance] = useState<TokenBalance>({
    balance: 0,
    symbol: 'sBITTE',
    rawBalance: BigInt(0),
    loading: true,
    error: null,
  });

  const fetchBalance = async (
    tokenAddress: string,
    setBalanceState: React.Dispatch<React.SetStateAction<TokenBalance>>
  ) => {
    if (!address) {
      setBalanceState((prev) => ({ ...prev, loading: false }));
      return;
    }

    try {
      setBalanceState((prev) => ({ ...prev, loading: true, error: null }));

      // Get token decimals
      const decimals = await client.readContract({
        address: tokenAddress as `0x${string}`,
        abi: tokenAbi,
        functionName: 'decimals',
      });

      // Get token symbol
      const tokenSymbol = await client.readContract({
        address: tokenAddress as `0x${string}`,
        abi: tokenAbi,
        functionName: 'symbol',
      });

      // Get balance of address
      const rawBalance = await client.readContract({
        address: tokenAddress as `0x${string}`,
        abi: tokenAbi,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      });

      // Format the balance with correct decimals
      const formattedBalance = parseFloat(
        formatUnits(rawBalance as bigint, decimals as number)
      );

      setBalanceState({
        balance: formattedBalance,
        symbol: tokenSymbol as string,
        rawBalance: rawBalance as bigint,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error(`Error fetching token balance for ${tokenAddress}:`, error);
      setBalanceState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
      }));
    }
  };

  const fetchAllBalances = async () => {
    await Promise.all([
      fetchBalance(BITTE_TOKEN_ADDRESS, setBitteBalance),
      fetchBalance(DBITTE_TOKEN_ADDRESS, setDBitteBalance),
      fetchBalance(SBITTE_TOKEN_ADDRESS, setSBitteBalance),
    ]);
  };

  useEffect(() => {
    fetchAllBalances();
  }, [address]);

  return {
    bitte: bitteBalance,
    dBitte: dBitteBalance,
    sBitte: sBitteBalance,
    refetch: fetchAllBalances,
  };
}
