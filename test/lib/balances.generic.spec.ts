import { getBalances } from '../../src/lib/balances/generic';
import { sepolia } from 'viem/chains';
import { Address } from 'viem';

// Create a mock function that we can update later
const mockReadContract = jest.fn();
// Mock viem's createPublicClient
jest.mock('viem', () => {
  const actual = jest.requireActual('viem');
  return {
    ...actual,
    createPublicClient: () => ({
      readContract: mockReadContract,
    }),
  };
});

describe('getBalances', () => {
  // Using some well-known token addresses on Sepolia
  // You might want to replace these with tokens you know exist on Sepolia
  const TEST_TOKENS: Address[] = [
    '0x1111111111111111111111111111111111111111',
    '0x2222222222222222222222222222222222222222',
    '0x3333333333333333333333333333333333333333',
  ];
  const TEST_BALANCES = [
    '0x0000000000000000000000000000000000000000000000000000000123456789',
    '0xf000000000000000000000000000000000000000000000000de0b6b3a7640000',
    '0x0000000000000000000000000000000000000000000000000000000000000001',
  ];
  mockReadContract.mockResolvedValue([BigInt(8181349), TEST_BALANCES]);

  const TEST_WALLET = '0x7f01D9b227593E033bf8d6FC86e634d27aa85568' as Address;

  it('should fetch balances for multiple tokens', async () => {
    const balances = await getBalances(sepolia, TEST_TOKENS, TEST_WALLET);
    expect(balances).toStrictEqual({
      [TEST_TOKENS[0]]: BigInt(TEST_BALANCES[0]).toString(),
      [TEST_TOKENS[1]]: BigInt(TEST_BALANCES[1]).toString(),
      [TEST_TOKENS[2]]: BigInt(TEST_BALANCES[2]).toString(),
    });
  });
});
