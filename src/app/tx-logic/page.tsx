'use client';
import { ReviewTransaction } from 'bitte-ai-chat';
import { KeyPair, keyStores, Near, Account } from 'near-api-js';
import { Transaction, Wallet } from '@near-wallet-selector/core';
import { useEffect, useState } from 'react';
import { useBitteWallet } from '@mintbase-js/react';

const ACCOUNT_ID = 'add-yours';
const PRIVATE_KEY = 'ed25519:add-yours';

const transaction: Transaction = {
  actions: [
    {
      type: 'FunctionCall',
      params: {
        methodName: 'set_greeting',
        args: {
          greeting: 'heya',
        },
        gas: '30000000000000',
        deposit: '0',
      },
    },
  ],
  receiverId: 'surgedev.near',
  signerId: ACCOUNT_ID,
};

function App() {
  const [account, setAccount] = useState<Account | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const { isConnected, selector, activeAccountId, connect } = useBitteWallet();

  const handleConnect = async () => {
    await connect();
    const wallet = await selector.wallet();
    setWallet(wallet);
  };

  useEffect(() => {
    ///////////////////////////////////
    //TEST WALLET OR TEST ACCOUNT TOGGLE
    ///////////////////////////////////
    async function initWallet() {
      if (isConnected) {
        setWallet(await selector.wallet());
      }
    }
    // async function initAccount() {
    //   const keypair = KeyPair.fromString(PRIVATE_KEY);
    //   const keyStore = new keyStores.InMemoryKeyStore();
    //   await keyStore.setKey('mainnet', ACCOUNT_ID, keypair);

    //   const near = new Near({
    //     networkId: 'mainnet',
    //     nodeUrl: 'https://rpc.mainnet.near.org',
    //     deps: { keyStore },
    //   });

    //   const account = new Account(near.connection, ACCOUNT_ID);
    //   setAccount(account);
    // }

    initWallet();
    //initAccount();
  }, [isConnected]);

  const handleSignout = async () => {
    const wallet = await selector.wallet();
    return wallet.signOut();
  };

  console.log(isConnected);
  if (!isConnected) {
    return (
      <div className='flex justify-center items-center mt-4'>
        <button
          className='bg-white text-black rounded p-3 hover:bg-[#e1e1e1]'
          onClick={handleConnect}
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div>
      {(account || wallet) && (
        <ReviewTransaction
          agentId='example-agent'
          transactions={[transaction]}
          wallet={wallet || undefined}
          account={account || undefined}
        />
      )}
      <div>
        <p>You are connected as {activeAccountId}</p>
        <div className='flex justify-center items-center mt-4'>
          <button
            className='bg-white text-black rounded p-3 hover:bg-[#e1e1e1]'
            onClick={handleSignout}
          >
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
