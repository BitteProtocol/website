import WalletBadge from '@/components/ui/wallet/WalletBadge';
import WalletAddress from '@/components/ui/wallet/WalletAddress';
import EvmNetworkSelector from '@/components/layout/EvmNetworkSelector';
import { useBitteWallet } from '@bitte-ai/react';
import { useWallet } from '@suiet/wallet-kit';
import { useAccount, useDisconnect } from 'wagmi';
import { Unlink } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ManageAccountsDialog from '@/components/layout/ManageAccountsDialog';
import { Skeleton } from '@/components/ui/skeleton';

const WalletSection = () => {
  const {
    isConnected,
    address: ethAddress,
    isConnecting,
    isReconnecting,
  } = useAccount();

  const { disconnect } = useDisconnect();

  const {
    connected: isSuiConnected,
    account: suiAccount,
    disconnect: disconnectSui,
    connecting: isSuiConnecting,
  } = useWallet();

  const {
    isConnected: isNearConnected,
    activeAccountId,
    selector,
    connect,
  } = useBitteWallet();

  const [isConnectModalOpen, setConnectModalOpen] = useState<boolean>(false);

  const handleSignout = async () => {
    const wallet = await selector.wallet();
    return wallet.signOut();
  };

  const handleSignIn = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  return (
    <div>
      <h2 className='text-xl font-semibold mb-4'>Accounts & Networks</h2>
      <div className='border-b border-zinc-800 mb-8 pb-2'></div>

      <h3 className='text-lg font-semibold mb-4'>Connected Wallets</h3>
      <p className='text-mb-silver text-sm font-medium mb-9'>
        These wallets are currently connected.
      </p>

      <div className='space-y-9'>
        {/* NEAR Wallet */}
        {isNearConnected && activeAccountId && (
          <div className='flex flex-col'>
            <div className='mb-2.5 inline-block'>
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
                className='px-2.5 border border-mb-red-30 bg-transparent self-center -mt-4'
                size='sm'
                onClick={handleSignout}
                aria-label='Disconnect'
              >
                <Unlink size={16} color='#EF4444' />
              </Button>
            </div>
          </div>
        )}

        {/* Ethereum Wallet - Connected */}
        {isConnected && ethAddress && (
          <div className='flex flex-col'>
            <div className='mb-2.5 inline-block'>
              <div className='inline-block'>
                <EvmNetworkSelector />
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <WalletAddress address={ethAddress as string} />
              <Button
                variant='outline'
                className='px-2.5 border border-mb-red-30 bg-transparent self-center -mt-4'
                size='sm'
                onClick={() => disconnect()}
                aria-label='Disconnect'
              >
                <Unlink size={16} color='#EF4444' />
              </Button>
            </div>
          </div>
        )}

        {/* Ethereum Wallet - Loading */}
        {(isConnecting || isReconnecting) && !isConnected && (
          <div className='flex flex-col'>
            <div className='mb-2.5 inline-block'>
              <Skeleton className='h-9 w-32' />
            </div>
            <div className='flex items-center justify-between'>
              <Skeleton className='h-6 w-64' />
            </div>
          </div>
        )}

        {/* SUI Wallet - Connected */}
        {isSuiConnected && suiAccount && (
          <div className='flex flex-col'>
            <div className='mb-2.5 inline-block'>
              <WalletBadge
                networkName='SUI'
                iconPath='/sui-logo.png'
                className=''
              />
            </div>
            <div className='flex items-center justify-between'>
              <WalletAddress address={suiAccount.address} />
              <Button
                variant='outline'
                className='px-2.5 border border-mb-red-30 bg-transparent self-center -mt-4'
                size='sm'
                onClick={disconnectSui}
                aria-label='Disconnect'
              >
                <Unlink size={16} color='#EF4444' />
              </Button>
            </div>
          </div>
        )}

        {/* SUI Wallet - Loading */}
        {isSuiConnecting && !isSuiConnected && (
          <div className='flex flex-col'>
            <div className='mb-2.5 inline-block'>
              <Skeleton className='h-9 w-24' />
            </div>
            <div className='flex items-center justify-between'>
              <Skeleton className='h-6 w-64' />
            </div>
          </div>
        )}

        {(isConnected || isNearConnected || isSuiConnected) && (
          <ManageAccountsDialog
            isOpen={isConnectModalOpen}
            setConnectModalOpen={setConnectModalOpen}
            isConnected={isConnected}
            isNearConnected={isNearConnected}
            isSuiConnected={isSuiConnected}
            handleSignIn={handleSignIn}
            isSidebar
          />
        )}

        {/* Fallback message if no wallets are connected or connecting */}
        {!isNearConnected &&
          !isConnected &&
          !isSuiConnected &&
          !isConnecting &&
          !isReconnecting &&
          !isSuiConnecting && (
            <p className='text-gray-400'>No wallets connected.</p>
          )}
      </div>
    </div>
  );
};

export default WalletSection;
