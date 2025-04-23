import Image from 'next/image';
import React, { useState } from 'react';
import { useWallet, useAccountBalance } from '@suiet/wallet-kit';
import CurrentlyConnected from './CurrentlyConnected';
import { Roboto_Mono } from 'next/font/google';
import WalletBadge from '../ui/wallet/WalletBadge';
import WalletAddress from '../ui/wallet/WalletAddress';
import WalletSelectModal from '../ui/wallet/WalletSelectModal';
import { SUI_WALLETS } from '@/lib/wallet/constants';
import { WalletConnectorProps } from '@/lib/wallet/types';

const roboto_mono = Roboto_Mono({ subsets: ['latin'] });

export const SuiWalletConnector: React.FC<WalletConnectorProps> = ({
  setConnectModalOpen,
  isManageDialog,
}) => {
  const wallet = useWallet();
  const { connected, select, disconnect, account, allAvailableWallets } =
    wallet;
  const { balance } = useAccountBalance();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Check if a specific wallet is installed by looking at allAvailableWallets
  const isWalletInstalled = (walletName: string) => {
    if (!allAvailableWallets) return false;

    return allAvailableWallets.some(
      (availableWallet) =>
        availableWallet.name.toLowerCase() === walletName.toLowerCase()
    );
  };

  const handleConnect = () => {
    setShowWalletModal(true);
    setConnectionError(null);
  };

  const handleSelectWallet = (walletName: string) => {
    try {
      select(walletName);
      setShowWalletModal(false);
      setConnectModalOpen?.(false);
      // Force a state update after a short delay to ensure the connection is complete
      setTimeout(() => {
        window.dispatchEvent(new Event('walletStateChanged'));
      }, 500);
    } catch (error) {
      console.error('Failed to connect to wallet:', error);
      setConnectionError(
        `Failed to connect to ${walletName}. Please try again or install the wallet.`
      );
    }
  };

  const handleDisconnect = () => {
    if (disconnect) {
      disconnect();
    }
  };

  if (!connected && !isManageDialog) {
    return (
      <>
        <div
          onClick={handleConnect}
          className='w-full bg-mb-gray-650 hover:bg-mb-blue-30 h-[69px] sm:h-[61px] flex items-center gap-3 rounded-md p-3 cursor-pointer transition-all duration-500 ease-in-out'
        >
          <div className='flex items-center gap-2 justify-between w-full'>
            <div className='flex items-center justify-center rounded-md h-[40px] w-[45px] bg-white'>
              <Image
                src='/sui-logo.png'
                width={24}
                height={24}
                alt='sui-wallet-icon'
              />
            </div>
            <div className='flex flex-col sm:flex-row gap-1.5 w-full'>
              <p className='text-sm font-semibold text-mb-white-50'>
                SUI Account
              </p>
              <div className='flex sm:ml-auto items-center'>
                <p className='text-mb-gray-50 text-xs italic'>
                  e.g.
                  <span
                    className={`ml-2 bg-mb-black-deep p-1 sm:p-1.5 rounded-md text-xs text-mb-blue-100 not-italic ${roboto_mono.className}`}
                  >
                    0x17c...4a08
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {showWalletModal && (
          <WalletSelectModal
            wallets={SUI_WALLETS}
            onClose={() => setShowWalletModal(false)}
            onSelectWallet={handleSelectWallet}
            isWalletInstalled={isWalletInstalled}
            connectionError={connectionError}
          />
        )}
      </>
    );
  }

  // If not connected or no account, return null
  if (!connected || !account) {
    return null;
  }

  // If in manage dialog, show the connected view with disconnect button
  if (isManageDialog) {
    return (
      <CurrentlyConnected
        chainIcon='/sui-logo.png'
        accountId={account.address}
        networkBadge={
          <WalletBadge networkName='SUI' iconPath='/sui-logo.png' />
        }
        network='SUI'
        balance={Number(balance) / 1e9}
        action={handleDisconnect}
      />
    );
  }

  // Default view for connected state
  return (
    <div>
      <WalletBadge
        networkName='SUI'
        iconPath='/sui-logo.png'
        className='mb-3'
      />
      <div className='flex justify-between items-center'>
        <WalletAddress address={account.address} />
        {isManageDialog && (
          <button
            onClick={handleDisconnect}
            className='text-mb-red-100 hover:text-mb-red-200 text-xs font-medium transition-all'
          >
            Disconnect
          </button>
        )}
      </div>
    </div>
  );
};
