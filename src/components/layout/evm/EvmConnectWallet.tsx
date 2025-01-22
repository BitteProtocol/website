import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { EvmAccount } from './EvmAccount';
import { EvmWalletOptions } from './EvmWalletOptionts';

const evmAccountTrigger = (
  <div className='w-full bg-[#141414] h-[80px] flex items-center gap-3 rounded-md p-3 cursor-pointer'>
    <div className='flex items-center justify-center h-[60px] w-[60px] bg-black rounded-md'>
      <Image
        src='/chains/evm_wallet_connector.svg'
        width={60}
        height={60}
        alt='connect-wallet-connect-logo'
      />
    </div>
    <div>
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
  const [isConnectModalOpen, setConnectModalOpen] = useState(false);

  const { isConnected } = useAccount();
  return isConnected ? (
    <EvmAccount />
  ) : (
    <>
      <Dialog open={isConnectModalOpen} onOpenChange={setConnectModalOpen}>
        <DialogTrigger>{evmAccountTrigger}</DialogTrigger>
        <DialogContent className='max-w-[510px] min-h-[465px] border border-[#334155] bg-black rounded-md'>
          <DialogTitle className='font-semibold text-xl'>
            Connect Wallet
          </DialogTitle>

          <EvmWalletOptions />
        </DialogContent>
      </Dialog>
    </>
  );
}
