import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  useAccount,
  useBalance,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useSwitchChain,
} from 'wagmi';

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function EvmAccount() {
  const { address, chain, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address, chainId });
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  const { chains, switchChain } = useSwitchChain();

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
            {Number(balance?.formatted).toFixed(4) || 0.0} {balance?.symbol}
          </small>
        </div>
      </div>
      <select
        className='bg-black text-white p-2 rounded-md'
        value={chainId}
        onChange={async (e) => {
          console.log({ e: e.target.value });

          const selectedChain = chains.find(
            (c) => c.id === Number(e.target.value)
          );
          // Handle chain change logic here
          console.log('Selected chain:', selectedChain);

          if (!selectedChain) return;
          await switchChain({
            chainId: selectedChain?.id,
          });
        }}
      >
        {chains.map((chain) => (
          <option key={chain.id} value={chain.id}>
            {chain.name}
          </option>
        ))}
      </select>
      <Button onClick={() => disconnect()}>Disconnect</Button>
    </div>
  );
}
