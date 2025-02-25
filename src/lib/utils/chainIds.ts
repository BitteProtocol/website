export const networkMapping: Record<number, { name: string; icon: string }> = {
  0: { name: 'NEAR', icon: '/chains/near.svg' },
  1: { name: 'Ethereum', icon: '/chains/ethereum.svg' },
  56: { name: 'BNB', icon: '/chains/bnb.svg' },
  100: { name: 'Gnosis', icon: '/chains/gnosis.svg' },
  137: { name: 'Polygon', icon: '/chains/polygon.svg' },
  250: { name: 'Avalanche', icon: '/chains/avalanche.svg' },
  42161: { name: 'Arbitrum', icon: '/chains/arbitrum.svg' },
  10: { name: 'Optimism', icon: '/chains/optimism.svg' },
  8453: { name: 'Base', icon: '/chains/base.svg' },
  11155111: { name: 'Sepolia', icon: '/chains/sepolia.svg' },
  // Add more mappings as needed
};

export function mapChainIdsToNetworks(chainIds: number[]) {
  return chainIds.map(
    (chainId) =>
      networkMapping[chainId] || {
        name: 'Unknown',
        icon: '/chains/unknown.svg',
      }
  );
}
