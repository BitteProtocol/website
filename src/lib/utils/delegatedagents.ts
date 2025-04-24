import { formatUnits } from 'viem';

export const formatTokenBalance = (
  rawBalance: bigint,
  decimals: number = 18,
  symbol: string
) => {
  const formatted = parseFloat(
    formatUnits(rawBalance, decimals)
  ).toLocaleString(undefined, {
    maximumFractionDigits: 4,
    minimumFractionDigits: 0,
  });

  return `${formatted} ${symbol}`;
};
