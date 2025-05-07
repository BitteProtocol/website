import { Address, Chain, parseAbi } from 'viem';
import { getBalances } from './generic';

export const MULTICALL_ADDRESS = '0xcA11bde05977b3631167028862bE2a173976CA11'; // Mainnet Multicall v3

// Token addresses (Sepolia)
export const BITTE_TOKEN_ADDRESS = '0x7D505943c86246B7d5459AA23Fd6c174E3088412';
export const DBITTE_TOKEN_ADDRESS =
  '0xc5020CC858dB41a77887dE1004E6A2C166c09175';
export const SBITTE_TOKEN_ADDRESS =
  '0x5C4b5813Be000770C589E5Cc5A2e278af3bC294e';

export const REWARD_CONTRACT_ADDRESS =
  '0xbCcC734ed1E98c5D47CeF13C64aC3cD7D8FCa15D';

export const multicallAbi = parseAbi([
  'function aggregate((address target, bytes callData)[]) view returns (uint256 blockNumber, bytes[] returnData)',
]);

export const tokenAbi = parseAbi([
  'function approve(address spender, uint256 amount) returns (bool)',
]);

export const stakingAbi = parseAbi([
  'function stake(address agent, uint256 amount) external returns (uint256)',
]);

export const rewardContractAbi = parseAbi([
  'function rewardConfigurations(address) view returns (uint256 perSecondEmissionRate)',
]);

export const stakingContractAbi = parseAbi([
  'function balanceOf(address) view returns (uint256)',
]);

export interface TokenBalance {
  address: Address;
  symbol: string;
  decimals: number;
  amount: bigint;
}

export interface BitteBalances {
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
