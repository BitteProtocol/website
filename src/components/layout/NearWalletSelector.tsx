'use client';

import { useBitteWallet } from '@mintbase-js/react';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { Button } from '../ui/button';
import { getBalance } from '@mintbase-js/rpc';
/* import BN from 'bn.js'; */
import { useState } from 'react';
import { formatNearAmount } from 'near-api-js/lib/utils/format';

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
      <div className='w-full bg-[#141414] h-[80px] flex items-center gap-3 rounded-md p-3'>
        <div className='flex items-center justify-center h-[60px] w-[60px] bg-black rounded-md'>
          <Image
            src='/chains/near_wallet_connector_v2.svg'
            width={60}
            height={60}
            alt='connect-wallet-modal-logo-near'
          />
        </div>
        <div>
          <div
            className='connect-chain-button'
            onClick={() => {
              handleSignIn();
              setConnectModalOpen(false);
            }}
          >
            NEAR Account
          </div>
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
