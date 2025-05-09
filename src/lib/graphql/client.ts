import { GraphQLClient } from 'graphql-request';

const endpoint =
  'https://api.studio.thegraph.com/query/23290/bitte-testnet/version/latest';

export const graphQLClient = new GraphQLClient(endpoint);
