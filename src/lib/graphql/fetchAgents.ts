import { graphQLClient } from './client';
import { GET_AGENTS_BY_STAKE } from './queries';

interface Agent {
  id: string;
  isActive: boolean;
  totalStaked: string;
  totalDelegated: string;
  stakes: Array<{
    id: string;
    amount: string;
    initialAmount: string;
  }>;
  delegates: Array<{
    id: string;
    staker: {
      id: string;
    };
    amount: string;
    initialAmount: string;
  }>;
}

interface GetAgentsResponse {
  registeredAgents: Agent[];
}

export async function fetchAgentsByStake(
  first: number = 10,
  skip: number = 0
): Promise<Agent[]> {
  try {
    const data = await graphQLClient.request<GetAgentsResponse>(
      GET_AGENTS_BY_STAKE,
      {
        first,
        skip,
      }
    );

    return data.registeredAgents;
  } catch (error) {
    console.error('Error fetching agents:', error);
    throw error;
  }
}
