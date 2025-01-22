'use client';

import { useBitteWallet } from '@mintbase-js/react';
import { Button } from '../ui/button';
import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';

export const NearWalletConnector = ({
  setConnectModalOpen,
}: {
  setConnectModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { isConnected, selector, connect, activeAccountId } = useBitteWallet();

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

  if (!isConnected) {
    return (
      <div
        className='w-full bg-[#141414] h-[80px] flex items-center gap-3 rounded-md p-3 cursor-pointer'
        onClick={() => {
          handleSignIn();
          setConnectModalOpen(false);
        }}
      >
        <div className='flex items-center justify-center h-[60px] w-[60px] bg-black rounded-md'>
          <Image
            src='/chains/near_wallet_connector_v2.svg'
            width={60}
            height={60}
            alt='connect-wallet-modal-logo-near'
          />
        </div>
        <div>
          <p className='text-lg text-[#F8FAFC] font-semibold mb-2'>
            NEAR Account
          </p>
          <p className='text-[#BABDC2] text-xs italic'>
            e.g.
            <span className='ml-2 bg-[#1F1F1F] p-1 rounded-md text-xs text-[#BABDC2] not-italic'>
              blackdragon.near
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex gap-2 items-center justify-center'>
      <p>{activeAccountId}</p>
      <Button onClick={handleSignout}>Disconnect</Button>
    </div>
  );
};
