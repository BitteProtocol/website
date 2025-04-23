import { Address, Chain } from 'viem';
import { getBalances } from './generic';

// Token addresses (Sepolia)
export const BITTE_TOKEN_ADDRESS = '0x7D505943c86246B7d5459AA23Fd6c174E3088412';
export const DBITTE_TOKEN_ADDRESS =
  '0xc5020CC858dB41a77887dE1004E6A2C166c09175';
export const SBITTE_TOKEN_ADDRESS =
  '0x5C4b5813Be000770C589E5Cc5A2e278af3bC294e';

interface TokenBalance {
  address: Address;
  symbol: string;
  decimals: number;
  amount: bigint;
}

interface BitteBalances {
  bitte: TokenBalance;
  dBitte: TokenBalance;
  sBitte: TokenBalance;
}

export async function getBitteTokenBalances(
  chain: Chain,
  walletAddress: Address
): Promise<BitteBalances> {
  const balances = await getBalances(
    chain,
    [BITTE_TOKEN_ADDRESS, DBITTE_TOKEN_ADDRESS, SBITTE_TOKEN_ADDRESS],
    walletAddress
  );
  return {
    bitte: {
      address: BITTE_TOKEN_ADDRESS,
      symbol: 'BITTE',
      decimals: 18,
      amount: BigInt(balances[BITTE_TOKEN_ADDRESS]),
    },
    dBitte: {
      address: DBITTE_TOKEN_ADDRESS,
      symbol: 'dBITTE',
      decimals: 18,
      amount: BigInt(balances[DBITTE_TOKEN_ADDRESS]),
    },
    sBitte: {
      address: SBITTE_TOKEN_ADDRESS,
      symbol: 'sBITTE',
      decimals: 18,
      amount: BigInt(balances[SBITTE_TOKEN_ADDRESS]),
    },
  };
}
