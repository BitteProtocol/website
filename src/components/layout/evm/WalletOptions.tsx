import Image from 'next/image';
import { useConnect } from 'wagmi';

export function WalletOptions() {
  const { connectors, connect } = useConnect();

  return connectors.map((connector) => (
    <div
      className='w-full bg-[#141414] h-[80px] flex items-center gap-3 rounded-md p-3 cursor-pointer'
      key={connector.uid}
      onClick={() => connect({ connector })}
    >
      <div className='flex items-center justify-center h-[60px] w-[60px] bg-black rounded-md overflow-hidden'>
        <Image
          src={
            connector.name.includes('Coinbase')
              ? '/wallets/coinbase.svg'
              : connector.name.includes('MetaMask')
                ? '/wallets/metamask.svg'
                : connector.name.includes('Phantom')
                  ? '/wallets/phantom.svg'
                  : '/wallets/evm_wallet_connector.svg'
          }
          width={60}
          height={60}
          alt={`${connector.name}-logo`}
        />
      </div>

      <p className='text-lg text-[#F8FAFC] font-semibold mb-2'>
        {connector.name}
      </p>
    </div>
  ));
}
