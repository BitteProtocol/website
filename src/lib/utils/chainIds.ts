type NetworkEntry = {
  name: string;
  icon: string;
};

export function getNetworkMapping(
  colorIcon?: boolean
): Record<number, NetworkEntry> {
  const baseIconPath = `/chains/${colorIcon ? 'colors/' : 'gray/new_'}`;
  return {
    0: { name: 'NEAR', icon: `${baseIconPath}near.svg` },
    1: { name: 'Ethereum', icon: `${baseIconPath}eth.svg` },
    56: { name: 'BNB', icon: `${baseIconPath}bnb.svg` },
    100: { name: 'Gnosis', icon: `${baseIconPath}gnosis.svg` },
    137: { name: 'Polygon', icon: `${baseIconPath}polygon.svg` },
    43114: { name: 'Avalanche', icon: `${baseIconPath}avax.svg` },
    42161: { name: 'Arbitrum', icon: `${baseIconPath}arbi.svg` },
    10: { name: 'Optimism', icon: `${baseIconPath}op.svg` },
    8453: { name: 'Base', icon: `${baseIconPath}base.svg` },
    101: { name: 'Sui', icon: `${baseIconPath}sui.svg` },
    11155111: { name: 'Sepolia', icon: `${baseIconPath}eth.svg` },

  };
}

export function mapChainIdsToNetworks(chainIds: number[], colorIcon?: boolean) {
  const networkMapping = getNetworkMapping(colorIcon);
  const filteredChainIds = chainIds
    .filter((chainId) => chainId in networkMapping)
    .slice(0, 8);
  return filteredChainIds.map(
    (chainId) =>
      networkMapping[chainId] || {
        name: 'Unknown',
        icon: '/chains/gray/new_eth.svg',
      }
  );
}
