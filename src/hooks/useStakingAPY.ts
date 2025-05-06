import {
  BITTE_TOKEN_ADDRESS,
  DBITTE_TOKEN_ADDRESS,
  SBITTE_TOKEN_ADDRESS,
} from '@/lib/balances/bitteTokens';
import { useEffect, useState } from 'react';
import { createPublicClient, http, parseAbi } from 'viem';
import { sepolia } from 'viem/chains';

export function useStakingAPY() {
  const [apy, setApy] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const calculateAPY = async () => {
      try {
        setLoading(true);

        const client = createPublicClient({
          chain: sepolia,
          transport: http(),
        });

        // Contract addresses - replace with your actual addresses
        const rewardContractAddress =
          '0xbCcC734ed1E98c5D47CeF13C64aC3cD7D8FCa15D';
        const delegateStakingContract = DBITTE_TOKEN_ADDRESS; // Replace with actual address
        const stakingContractAddress = SBITTE_TOKEN_ADDRESS; // Replace with actual address
        const bitteTokenAddress = BITTE_TOKEN_ADDRESS; // Replace with actual address

        // ABIs for the contract functions we need
        const rewardContractAbi = parseAbi([
          'function rewardConfigurations(address) view returns (uint256 perSecondEmissionRate)',
        ]);

        const stakingContractAbi = parseAbi([
          'function balanceOf(address) view returns (uint256)',
        ]);

        // Get perSecondEmissionRate
        const perSecondEmissionRate = await client.readContract({
          address: rewardContractAddress,
          abi: rewardContractAbi,
          functionName: 'rewardConfigurations',
          args: [delegateStakingContract],
        });

        // Get totalStaked
        const totalStaked = await client.readContract({
          address: stakingContractAddress,
          abi: stakingContractAbi,
          functionName: 'balanceOf',
          args: [bitteTokenAddress],
        });

        console.log({ totalStaked, perSecondEmissionRate });

        // Calculate APY based on the formula
        // totalAPY = [totalStaked + (perSecondEmissionRate * 365 * 24 * 60 * 60)] / totalStaked
        const secondsInYear = 365 * 24 * 60 * 60;

        // Handle division by zero
        if (totalStaked === 0n) {
          setApy(0);
        } else {
          const annualEmission = perSecondEmissionRate * BigInt(secondsInYear);
          const totalAPY =
            Number(((totalStaked + annualEmission) * 10000n) / totalStaked) /
            10000;
          setApy(totalAPY);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        console.error('Error calculating APY:', err);
      } finally {
        setLoading(false);
      }
    };

    calculateAPY();
  }, []);

  return { apy, loading, error };
}
