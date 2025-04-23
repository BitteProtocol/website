import { fetchAgentsByStake } from '@/lib/graphql/fetchAgents';
import { useQuery } from '@tanstack/react-query';

export function useOnChainAgents(first = 10, skip = 0) {
  return useQuery({
    queryKey: ['agents', { first, skip }],
    queryFn: () => fetchAgentsByStake(first, skip),
  });
}
