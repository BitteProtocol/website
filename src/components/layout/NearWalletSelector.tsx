'use client';

import { useBitteWallet } from '@mintbase-js/react';
import { Button } from '../ui/button';

export const NearWalletConnector = () => {
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
      <div>
        <Button onClick={handleSignIn}>Connect Wallet</Button>
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
