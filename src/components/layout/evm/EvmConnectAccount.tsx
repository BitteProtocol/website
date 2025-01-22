import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { useState } from 'react';
import { WalletOptions } from './WalletOptions';

const evmAccountTrigger = (
  <div className='w-full bg-[#141414] h-[80px] flex items-center gap-3 rounded-md p-3 cursor-pointer'>
    <div className='flex items-center justify-center h-[60px] w-[60px] bg-black rounded-md'>
      <Image
        src='/wallets/evm_wallet_connector.svg'
        width={60}
        height={60}
        alt='connect-wallet-connect-logo'
      />
    </div>
    <div className='text-start'>
      <p className='text-lg text-[#F8FAFC] font-semibold mb-2'>EVM Account</p>
      <p className='text-[#BABDC2] text-xs italic'>
        e.g.
        <span className='ml-2 bg-[#1F1F1F] p-1 rounded-md text-xs text-[#BABDC2] not-italic'>
          0xd8da6...aa96045
        </span>
      </p>
    </div>
  </div>
);

export function EvmConnectWallet() {
  const [isEVMConnectModalOpen, setIsEVMConnectModalOpen] = useState(false);

  return (
    <Dialog
      open={isEVMConnectModalOpen}
      onOpenChange={setIsEVMConnectModalOpen}
    >
      <DialogTrigger>{evmAccountTrigger}</DialogTrigger>
      <DialogContent className='max-w-[485px] min-h-[465px] border border-[#334155] bg-black rounded-md'>
        <DialogTitle className='font-semibold text-xl'>
          Connect Wallet
        </DialogTitle>

        <WalletOptions />
        <p>
          Haven&apos;t got a wallet?{' '}
          <a
            className='font-bold'
            href='https://walletguide.walletconnect.network/'
            target='_blank'
            rel='noreferrer'
          >
            Get Started
          </a>
        </p>
      </DialogContent>
    </Dialog>
  );
}
