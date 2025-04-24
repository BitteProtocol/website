import { gql } from 'graphql-request';

export const GET_AGENTS_BY_STAKE = gql`
  query GetAgents($first: Int, $skip: Int) {
    agents: registeredAgents(
      orderBy: totalStaked
      orderDirection: desc
      first: $first
      skip: $skip
    ) {
      id
      isActive
      totalStaked
      totalDelegated
      stakes(where: { amount_gt: 0 }) {
        id
        amount
        initialAmount
      }
      delegates {
        id
        staker {
          id
        }
        amount
        initialAmount
      }
    }
  }
`;
