import WalletBadge from '@/components/ui/wallet/WalletBadge';
import WalletAddress from '@/components/ui/wallet/WalletAddress';
import EvmNetworkSelector from '@/components/layout/EvmNetworkSelector';
import { useBitteWallet } from '@bitte-ai/react';
import { useWallet } from '@suiet/wallet-kit';
import { useAccount } from 'wagmi';
import { Copy } from 'lucide-react';
import { useState } from 'react';

const WalletSection = () => {
  const { isConnected, address: ethAddress } = useAccount();
  const { connected: isSuiConnected, account: suiAccount } = useWallet();
  const { isConnected: isNearConnected, activeAccountId } = useBitteWallet();

  const [copiedAddresses, setCopiedAddresses] = useState<
    Record<string, boolean>
  >({});

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);

    // Set copied state for this address
    setCopiedAddresses((prev) => ({ ...prev, [address]: true }));

    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopiedAddresses((prev) => ({ ...prev, [address]: false }));
    }, 2000);
  };

  return (
    <div>
      <h2 className='text-xl font-bold mb-4'>Accounts & Networks</h2>
      <div className='border-b border-zinc-800 mb-8 pb-2'></div>

      <h3 className='text-lg font-bold mb-4'>Connected Wallets</h3>
      <p className='text-gray-400 mb-6'>
        These wallets are currently connected.
      </p>

      <div className='space-y-6'>
        {/* NEAR Wallet */}
        {isNearConnected && activeAccountId && (
          <div className='mb-6 p-4 bg-zinc-900 rounded-md'>
            <div className='mb-4'>
              <WalletBadge
                networkName='NEAR'
                iconPath='/chains/near_wallet_connector_v2.svg'
                className='mb-3'
              />
            </div>
            <div className='flex items-center justify-between'>
              <WalletAddress address={activeAccountId} isNearAddress={true} />
              <button
                className='text-gray-400 hover:text-white'
                onClick={() => copyAddress(activeAccountId)}
                title='Copy address'
              >
                <Copy size={18} />
              </button>
            </div>
            {copiedAddresses[activeAccountId] && (
              <span className='text-green-500 text-xs mt-1 block'>Copied!</span>
            )}
          </div>
        )}

        {/* Ethereum Wallet */}
        {isConnected && ethAddress && (
          <div className='mb-6 p-4 bg-zinc-900 rounded-md'>
            <div className='mb-4'>
              <EvmNetworkSelector />
            </div>
            <div className='flex items-center justify-between'>
              <WalletAddress address={ethAddress as string} />
              <button
                className='text-gray-400 hover:text-white'
                onClick={() => copyAddress(ethAddress as string)}
                title='Copy address'
              >
                <Copy size={18} />
              </button>
            </div>
            {copiedAddresses[ethAddress as string] && (
              <span className='text-green-500 text-xs mt-1 block'>Copied!</span>
            )}
          </div>
        )}

        {/* SUI Wallet */}
        {isSuiConnected && suiAccount && (
          <div className='mb-6 p-4 bg-zinc-900 rounded-md'>
            <div className='mb-4'>
              <WalletBadge
                networkName='SUI'
                iconPath='/sui-logo.png'
                className='mb-3'
              />
            </div>
            <div className='flex items-center justify-between'>
              <WalletAddress address={suiAccount.address} />
              <button
                className='text-gray-400 hover:text-white'
                onClick={() => copyAddress(suiAccount.address)}
                title='Copy address'
              >
                <Copy size={18} />
              </button>
            </div>
            {copiedAddresses[suiAccount.address] && (
              <span className='text-green-500 text-xs mt-1 block'>Copied!</span>
            )}
          </div>
        )}

        {/* Fallback message if no wallets are connected */}
        {!isNearConnected && !isConnected && !isSuiConnected && (
          <p className='text-gray-400'>No wallets connected.</p>
        )}
      </div>
    </div>
  );
};

export default WalletSection;
