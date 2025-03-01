import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { MB_URL } from '@/lib/url';
import { useWindowSize } from '@/lib/utils/useWindowSize';
import { PlusCircle, Link2 } from 'lucide-react';
import Image from 'next/image';
import React, { Dispatch, SetStateAction } from 'react';
import { Button } from '../ui/button';
import { NearWalletConnector } from './NearWalletSelector';

interface ConnectDialogProps {
  isOpen: boolean;
  setConnectModalOpen: Dispatch<SetStateAction<boolean>>;
  isWelcomeMessage?: boolean;
  isSidebar?: boolean;
  sidebarOpen?: boolean;
}

const ConnectDialog: React.FC<ConnectDialogProps> = ({
  isOpen,
  setConnectModalOpen,
  isWelcomeMessage,
  isSidebar,
  sidebarOpen,
}) => {
  const { width } = useWindowSize();
  const isMobile = !!width && width < 1024;

  const content = (
    <>
      <div className='flex flex-col gap-4'>
        <div className='w-full bg-[#141414] h-[80px] flex items-center gap-3 rounded-md p-3'>
          <div className='flex items-center justify-center h-[60px] w-[60px] bg-black rounded-md'>
            <Image
              src='/chains/evm_wallet_connector.svg'
              width={60}
              height={60}
              alt='connect-wallet-connect-logo'
            />
          </div>
          <div>
            <div className='mb-2'>
              <appkit-connect-button label='EVM Account' />
            </div>
            <p className='text-[#BABDC2] text-xs italic'>
              e.g.
              <span className='ml-2 bg-[#1F1F1F] p-1 rounded-md text-xs text-[#BABDC2] not-italic'>
                0xd8da6...aa96045
              </span>
            </p>
          </div>
        </div>
        <NearWalletConnector setConnectModalOpen={setConnectModalOpen} />
      </div>
      <div
        className={`border-b border-[#334155] ${isMobile ? 'my-9' : ''}`}
      ></div>
      <a
        className='w-full bg-[#141414] h-[80px] flex items-center gap-3 rounded-md p-3 cursor-pointer mt-auto'
        href={MB_URL.BITTE_WALLET_NEW_ACCOUNT}
        target='_blank'
        rel='noreferrer'
      >
        <div className='flex items-center justify-center h-[60px] w-[60px] bg-white rounded-md'>
          <PlusCircle size={32} color='black' />
        </div>
        <div>
          <p className='text-lg text-[#F8FAFC] font-semibold mb-2'>
            Create New Account
          </p>
          <p className='text-[#BABDC2] text-xs'>for EVM and NEAR chains</p>
        </div>
      </a>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setConnectModalOpen}>
        <DrawerTrigger asChild>
          <Button
            onClick={() => setConnectModalOpen(true)}
            className={`${isWelcomeMessage ? 'w-[137px]' : 'w-full'}`}
          >
            Connect
          </Button>
        </DrawerTrigger>
        <DrawerContent className='p-6 border-none'>
          <DrawerTitle className='font-semibold text-xl mb-7 mt-5'>
            Connect Wallet
          </DrawerTitle>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setConnectModalOpen}>
      <DialogTrigger>
        {sidebarOpen ? (
          <Button className='w-full'>{'Connect Wallet'}</Button>
        ) : isSidebar ? (
          <Button size='icon'>
            <Link2 size={16} />
          </Button>
        ) : (
          <Button className='w-[137px]'>Connect</Button>
        )}
      </DialogTrigger>
      <DialogContent className='max-w-[510px] min-h-[465px] border border-[#334155] bg-black rounded-md'>
        <DialogTitle className='font-semibold text-xl'>
          Connect Wallet
        </DialogTitle>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default ConnectDialog;
