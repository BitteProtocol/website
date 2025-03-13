'use client';

import { useBitteWallet } from '@bitte-ai/react';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { getBalance } from '@mintbase-js/rpc';
import { useState } from 'react';
import { formatNearAmount } from 'near-api-js/lib/utils/format';
import CurrentlyConnected from './CurrentlyConnected';
import ConnectAccountCard from './ConnectAccountCard';

export const NearWalletConnector = ({
  setConnectModalOpen,
}: {
  setConnectModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { isConnected, selector, connect, activeAccountId } = useBitteWallet();

  const [balance, setBalance] = useState<string>('0');

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

  useEffect(() => {
    const fetchBalance = async () => {
      if (activeAccountId) {
        const balance = await getBalance({
          accountId: activeAccountId,
          rpcUrl: 'https://rpc.mainnet.near.org',
        });
        setBalance(balance);
      }
    };
    fetchBalance();
  }, [activeAccountId]);

  if (!isConnected) {
    return (
      <ConnectAccountCard
        action={[handleSignIn, () => setConnectModalOpen(false)]}
        icon1='/near_connect_icon.svg'
        text='NEAR Account'
        account='blackdragon.near'
      />
    );
  }

  return (
    <CurrentlyConnected
      chainIcon='/near_connect_icon.svg'
      accountId={activeAccountId || ''}
      networkBadge={
        <div className='bg-[#27272A] rounded-full py-0.5 px-3 flex items-center gap-2'>
          <div className='bg-black p-0.5 rounded'>
            <Image
              src='/chains/near_wallet_connector_v2.svg'
              width={14}
              height={14}
              alt='connect-wallet-modal-logo-near'
            />
          </div>
          <span className='text-xs text-[#FAFAFA] font-normal'>NEAR</span>
        </div>
      }
      network='NEAR'
      balance={formatNearAmount(balance, 2)}
      action={handleSignout}
    />
  );
};
