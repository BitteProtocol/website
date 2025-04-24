import { getBalances } from '../../src/lib/balances/generic';
import { sepolia } from 'viem/chains';
import { BITTE_TOKEN_ADDRESS } from '../../src/lib/balances/bitteTokens';

describe('e2e: getBalances', () => {
  it('Real Fetch Zero Balance', async () => {
    const balances = await getBalances(
      sepolia,
      [BITTE_TOKEN_ADDRESS],
      '0x1111111111111111111111111111111111111111'
    );
    expect(balances).toStrictEqual({
      [BITTE_TOKEN_ADDRESS]: BigInt(0).toString(),
    });
  });
});
