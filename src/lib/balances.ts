import {
  Address,
  Chain,
  createPublicClient,
  decodeFunctionResult,
  encodeFunctionData,
  http,
} from 'viem';

const balanceOfAbi = [
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const;

const MULTICALL_ADDRESS = '0xcA11bde05977b3631167028862bE2a173976CA11'; // Mainnet Multicall v3

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

export async function getBalances(
  chain: Chain,
  tokenAddresses: Address[],
  walletAddress: Address
): Promise<Record<Address, bigint>> {
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
    }),
  }));

  return Object.assign({}, ...balances);
}
