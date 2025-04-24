import {
  Address,
  Chain,
  createPublicClient,
  decodeFunctionResult,
  encodeFunctionData,
  http,
} from 'viem';

const MULTICALL_ADDRESS = '0xcA11bde05977b3631167028862bE2a173976CA11'; // Mainnet Multicall v3

const balanceOfAbi = [
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const;

const multicallAbi = [
  {
    type: 'function',
    name: 'aggregate',
    inputs: [
      {
        name: 'calls',
        type: 'tuple[]',
        components: [
          { name: 'target', type: 'address' },
          { name: 'callData', type: 'bytes' },
        ],
      },
    ],
    outputs: [
      { name: 'blockNumber', type: 'uint256' },
      { name: 'returnData', type: 'bytes[]' },
    ],
    stateMutability: 'view',
  },
] as const;

/**
 * Fetches token balances for multiple ERC20 tokens in a single multicall
 * using the Multicall v3 contract.
 * Note that this doens't fetch token decimals!
 *
 * @param chain - The viem Chain object representing the network to query
 * @param tokenAddresses - Array of ERC20 token contract addresses to check balances for
 * @param walletAddress - The address of the wallet to check balances of
 *
 * @returns A record mapping token addresses to their balances as strings in WEI
 * @example
 * const balances = await getBalances(
 *   sepolia,
 *   ['0x1...', '0x2...'],  // token addresses
 *   '0x3...'              // wallet address
 * );
 * // Returns: { "0x1...": "1000000000000000000", "0x2...": "2000000000000000000" }
 */
export async function getBalances(
  chain: Chain,
  tokenAddresses: Address[],
  walletAddress: Address
): Promise<Record<Address, string>> {
  const client = createPublicClient({
    chain,
    transport: http(),
  });
  const calls = tokenAddresses.map((address: Address) => ({
    target: address,
    callData: encodeFunctionData({
      abi: balanceOfAbi,
      functionName: 'balanceOf',
      args: [walletAddress],
    }),
  }));

  const result = await client.readContract({
    address: MULTICALL_ADDRESS,
    abi: multicallAbi,
    functionName: 'aggregate',
    args: [calls],
  });
  const [, returnData] = result;

  const balances = returnData.map((data: `0x${string}`, index: number) => ({
    [tokenAddresses[index]]: decodeFunctionResult({
      abi: balanceOfAbi,
      functionName: 'balanceOf',
      data,
    }).toString(),
  }));
  return Object.assign({}, ...balances);
}
