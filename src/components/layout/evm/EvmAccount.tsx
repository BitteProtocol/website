import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { formatUnits } from 'viem';
import {
  useAccount,
  useBalance,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from 'wagmi';

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function EvmAccount() {
  const { address, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  console.log({ balance });

  return (
    <div className='flex gap-2 items-center justify-between'>
      <div className='flex items-center gap-2'>
        <Image
          src={`/chains/new_eth.svg`} // TO DO: replace with proper chain logo
          width={46}
          height={46}
          alt={`${chain?.name}-logo`}
        />
        <div>
          {ensAvatar && <img alt='ENS Avatar' src={ensAvatar} />}
          {address && (
            <div>
              {ensName ? `${ensName} (${address})` : shortenAddress(address)}
            </div>
          )}
          <small>
            {balance?.value ? formatUnits(balance?.value, 12) : 0.0}{' '}
            {balance?.symbol}
          </small>
        </div>
      </div>
      <Button onClick={() => disconnect()}>Disconnect</Button>
    </div>
  );
}
