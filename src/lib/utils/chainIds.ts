export const networkMapping: Record<number, { name: string; icon: string }> = {
  0: { name: 'NEAR', icon: '/chains/new_near.svg' },
  1: { name: 'Ethereum', icon: '/chains/new_eth.svg' },
  56: { name: 'BNB', icon: '/chains/new_bnb.svg' },
  100: { name: 'Gnosis', icon: '/chains/new_gnosis.svg' },
  137: { name: 'Polygon', icon: '/chains/new_polygon.svg' },
  250: { name: 'Avalanche', icon: '/chains/avax.svg' },
  42161: { name: 'Arbitrum', icon: '/chains/new_arbi.svg' },
  10: { name: 'Optimism', icon: '/chains/new_op.svg' },
  8453: { name: 'Base', icon: '/chains/new_base.svg' },
  11155111: { name: 'Sepolia', icon: '/chains/new_eth.svg' },
  // Add more mappings as needed
};

export function mapChainIdsToNetworks(chainIds: number[]) {
  // Filter and limit the chain IDs to those present in networkMapping and limit to 9
  const filteredChainIds = chainIds
    .filter((chainId) => chainId in networkMapping)
    .slice(0, 8);
  return filteredChainIds.map(
    (chainId) =>
      networkMapping[chainId] || {
        name: 'Unknown',
        icon: '/chains/new_eth.svg',
      }
  );
}
