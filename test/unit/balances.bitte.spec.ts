import { Chain, Address } from 'viem';
import {
  getBitteTokenBalances,
  BITTE_TOKEN_ADDRESS,
  DBITTE_TOKEN_ADDRESS,
  SBITTE_TOKEN_ADDRESS,
} from '../../src/lib/balances/bitteTokens';
import { getBalances } from '../../src/lib/balances/generic';

jest.mock('../../src/lib/balances/generic', () => {
  return {
    getBalances: jest.fn(),
  };
});

const ZERO = BigInt(0);
const ONE = BigInt(1e18);
const TWO = BigInt(2e18);

describe('getBitteTokenBalances', () => {
  const mockChain = {} as Chain;
  const mockWalletAddress =
    '0x1234567890123456789012345678901234567890' as Address;
  const mockBalances = {
    [BITTE_TOKEN_ADDRESS]: ZERO,
    [DBITTE_TOKEN_ADDRESS]: ONE,
    [SBITTE_TOKEN_ADDRESS]: TWO,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getBalances as jest.Mock).mockResolvedValue(mockBalances);
  });

  it('should transform raw balances into BitteBalances', async () => {
    const result = await getBitteTokenBalances(mockChain, mockWalletAddress);

    expect(getBalances).toHaveBeenCalledWith(
      mockChain,
      [BITTE_TOKEN_ADDRESS, DBITTE_TOKEN_ADDRESS, SBITTE_TOKEN_ADDRESS],
      mockWalletAddress
    );

    expect(result).toEqual({
      bitte: {
        address: BITTE_TOKEN_ADDRESS,
        symbol: 'BITTE',
        decimals: 18,
        amount: ZERO,
      },
      dBitte: {
        address: DBITTE_TOKEN_ADDRESS,
        symbol: 'dBITTE',
        decimals: 18,
        amount: ONE,
      },
      sBitte: {
        address: SBITTE_TOKEN_ADDRESS,
        symbol: 'sBITTE',
        decimals: 18,
        amount: TWO,
      },
    });
  });
});
