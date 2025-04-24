import WalletBadge from '@/components/ui/wallet/WalletBadge';
import WalletAddress from '@/components/ui/wallet/WalletAddress';
import EvmNetworkSelector from '@/components/layout/EvmNetworkSelector';
import { useBitteWallet } from '@bitte-ai/react';
import { useWallet } from '@suiet/wallet-kit';
import { useAccount } from 'wagmi';
import { Copy, Unlink } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const WalletSection = () => {
  const { isConnected, address: ethAddress, disconnect } = useAccount();
  const {
    connected: isSuiConnected,
    account: suiAccount,
    disconnect: disconnectSui,
  } = useWallet();
  const {
    isConnected: isNearConnected,
    activeAccountId,
    selector,
  } = useBitteWallet();

  const [copiedAddresses, setCopiedAddresses] = useState<
    Record<string, boolean>
  >({});

  const handleSignout = async () => {
    const wallet = await selector.wallet();
    return wallet.signOut();
  };

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
      <h2 className='text-xl font-semibold mb-4'>Accounts & Networks</h2>
      <div className='border-b border-zinc-800 mb-8 pb-2'></div>

      <h3 className='text-lg font-semibold mb-4'>Connected Wallets</h3>
      <p className='text-mb-silver text-sm font-medium mb-6'>
        These wallets are currently connected.
      </p>

      <div className='space-y-2'>
        {/* NEAR Wallet */}
        {isNearConnected && activeAccountId && (
          <>
            <div className='mb-2 inline-block'>
              <WalletBadge
                networkName='NEAR'
                iconPath='/chains/near_wallet_connector_v2.svg'
                className=''
              />
            </div>
            <div className='flex items-center justify-between'>
              <WalletAddress address={activeAccountId} isNearAddress={true} />
              <Button
                variant='outline'
                className='px-2.5 border border-mb-red-30 bg-transparent'
                size='sm'
                onClick={handleSignout}
                aria-label='Disconnect'
              >
                <Unlink size={16} color='#EF4444' />
              </Button>
            </div>
          </>
        )}

        {/* Ethereum Wallet */}
        {isConnected && ethAddress && (
          <>
            <div className='mb-2 inline-block'>
              <EvmNetworkSelector />
            </div>
            <div className='flex items-center justify-between'>
              <WalletAddress address={ethAddress as string} />
              <Button
                variant='outline'
                className='px-2.5 border border-mb-red-30 bg-transparent'
                size='sm'
                onClick={disconnect}
                aria-label='Disconnect'
              >
                <Unlink size={16} color='#EF4444' />
              </Button>
            </div>
          </>
        )}

        {/* SUI Wallet */}
        {isSuiConnected && suiAccount && (
          <>
            <div className='mb-2 inline-block'>
              <WalletBadge
                networkName='SUI'
                iconPath='/sui-logo.png'
                className='mb-3'
              />
            </div>
            <div className='flex items-center justify-between'>
              <WalletAddress address={suiAccount.address} />
              <Button
                variant='outline'
                className='px-2.5 border border-mb-red-30 bg-transparent'
                size='sm'
                onClick={disconnectSui}
                aria-label='Disconnect'
              >
                <Unlink size={16} color='#EF4444' />
              </Button>
            </div>
          </>
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
