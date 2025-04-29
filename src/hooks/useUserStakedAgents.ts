import { graphQLClient } from '@/lib/graphql/client';
import { GET_USER_STAKES } from '@/lib/graphql/queries';
import { useEffect, useState } from 'react';
import { formatUnits } from 'viem';

// Type definitions matching your GraphQL schema
interface Staker {
  id: string;
}

interface Delegation {
  id: string;
  amount: string;
  initialAmount: string;
  staker: Staker;
}

interface RegisteredAgent {
  id: string;
  isActive: boolean;
  totalStaked: string;
  totalDelegated: string;
  delegates: Delegation[];
}

interface QueryResponse {
  registeredAgents: RegisteredAgent[];
}

// Processed user delegation for UI consumption
export interface UserDelegation {
  delegationId: string;
  agentId: string;
  amount: string;
  formattedAmount: string;
  numericAmount: number;
  initialAmount: string;
}

export function useUserStakedAgents(address?: `0x${string}`) {
  const [stakes, setStakes] = useState<UserDelegation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalStaked, setTotalStaked] = useState(0);
  const [formattedTotal, setFormattedTotal] = useState('0');

  const fetchUserDelegations = async () => {
    if (!address) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Call the GraphQL API with the user's address
      const data = await graphQLClient.request<QueryResponse>(GET_USER_STAKES, {
        address: address.toLowerCase(),
      });

      // Process results to format for UI
      const userDelegations: UserDelegation[] = [];
      let total = 0;

      // Loop through all agents
      data.registeredAgents.forEach((agent) => {
        // Skip agents with no delegations for this user
        if (!agent.delegates || agent.delegates.length === 0) return;

        // Process each delegation for this agent
        agent.delegates.forEach((delegation) => {
          // Convert BigInt amount to human-readable number
          const numericAmount = parseFloat(
            formatUnits(BigInt(delegation.amount), 18)
          );
          total += numericAmount;

          // Create a processed delegation object
          userDelegations.push({
            delegationId: delegation.id,
            agentId: agent.id,
            amount: delegation.amount,
            initialAmount: delegation.initialAmount,
            numericAmount,
            formattedAmount: numericAmount.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            }),
          });
        });
      });

      // Sort delegations by amount (largest first)
      userDelegations.sort((a, b) => b.numericAmount - a.numericAmount);

      // Update state with processed data
      setStakes(userDelegations);
      setTotalStaked(total);
      setFormattedTotal(
        total.toLocaleString(undefined, { maximumFractionDigits: 2 })
      );
    } catch (err) {
      console.error('Error fetching user delegations:', err);
      setError(
        err instanceof Error ? err : new Error('Failed to fetch delegations')
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch delegations when the address changes
  useEffect(() => {
    fetchUserDelegations();
  }, [address]);

  return {
    stakes,
    totalStaked,
    formattedTotal,
    isLoading,
    error,
    refetch: fetchUserDelegations,
  };
}
