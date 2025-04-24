import { graphQLClient } from '@/lib/graphql/client';
import { GET_AGENTS_BY_STAKE } from '@/lib/graphql/queries';
import { useEffect, useState } from 'react';

// Reuse your existing types
export interface DelegatedAgent {
  id: string;
  isActive: boolean;
  totalStaked: string;
  totalDelegated: string;
  delegates: [
    {
      id: string;
      staker: {
        id: string;
      };
      amount: string;
      initialAmount: string;
    },
  ];
}

export interface DelegatedAgentsResponse {
  agents: DelegatedAgent[];
}

export function useDelegatedAgents() {
  const [agents, setAgents] = useState<DelegatedAgent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = async () => {
    try {
      setLoading(true);

      const data = await graphQLClient.request<DelegatedAgentsResponse>(
        GET_AGENTS_BY_STAKE,
        {
          first: 10,
          skip: 0,
        }
      );

      setAgents(data.agents);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching agents:', err);
      setError('Failed to load agents data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return {
    agents,
    loading,
    error,
    refetch: fetchAgents,
  };
}
