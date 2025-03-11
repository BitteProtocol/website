'use client';

import { useBitteWallet } from '@bitte-ai/react';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { Button } from '../ui/button';
import { getBalance } from '@mintbase-js/rpc';
import { useState } from 'react';
import { formatNearAmount } from 'near-api-js/lib/utils/format';
import { Roboto_Mono } from 'next/font/google';

const roboto_mono = Roboto_Mono({ subsets: ['latin'] });

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
      <div
        className='w-full bg-[#232323] hover:bg-[#60A5FA4D] h-[61px] flex items-center gap-3 rounded-md p-3 cursor-pointer'
        onClick={() => {
          handleSignIn();
          setConnectModalOpen(false);
        }}
      >
        <div className='flex items-center gap-2'>
          <Image
            src='/near_connect_icon.svg'
            width={40}
            height={40}
            alt='connect-wallet-connect-logo'
          />

          <p className='text-sm font-semibold text-[#F8FAFC]'>NEAR Account</p>
        </div>
        <div className='flex ml-auto items-center'>
          <p className='text-[#BABDC2] text-xs italic'>
            e.g.
            <span
              className={`ml-2 bg-[#010101] p-1.5 rounded-md text-xs text-[#60A5FA] not-italic ${roboto_mono.className}`}
            >
              blackdragon.near
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex gap-2 items-center justify-between'>
      <div className='flex items-center gap-2'>
        <Image
          src='/chains/near_wallet_connector_v2.svg'
          width={46}
          height={46}
          alt='connect-wallet-modal-logo-near'
        />
        <div>
          <p>{activeAccountId}</p>
          <small>{formatNearAmount(balance, 2)} NEAR</small>
        </div>
      </div>
      <Button onClick={handleSignout}>Disconnect</Button>
    </div>
  );
};
