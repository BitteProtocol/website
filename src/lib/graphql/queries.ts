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

export const GET_USER_STAKES = gql`
  query GetUserDelegatedAgents($address: Bytes) {
    registeredAgents {
      id
      isActive
      totalStaked
      totalDelegated
      delegates(where: { staker_: { id: $address } }) {
        id
        amount
        initialAmount
        staker {
          id
        }
      }
    }
  }
`;
