import React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { NearWalletConnector } from './NearWalletSelector';
import { MB_URL } from '@/lib/url';
import { Dispatch, SetStateAction } from 'react';
import { useWindowSize } from '@/lib/utils/useWindowSize';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerTitle,
} from '@/components/ui/drawer';

interface ConnectDialogProps {
  isOpen: boolean;
  setConnectModalOpen: Dispatch<SetStateAction<boolean>>;
}

const ConnectDialog: React.FC<ConnectDialogProps> = ({
  isOpen,
  setConnectModalOpen,
}) => {
  const { width } = useWindowSize();
  const isMobile = !!width && width < 1024;

  const content = (
    <>
      <div className='flex flex-col gap-4'>
        <div className='w-full bg-[#141414] h-[80px] flex items-center gap-3 rounded-md p-3 cursor-pointer mt-auto'>
          <div className='flex items-center justify-center h-[60px] w-[60px] bg-white rounded-md'>
            <PlusCircle size={32} color='black' />
          </div>
          <div>
            <appkit-connect-button label='EVM Account' />
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
          <Button onClick={() => setConnectModalOpen(true)} className='w-full'>
            Connect
          </Button>
        </DrawerTrigger>
        <DrawerContent className='p-6'>
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
        <Button className='min-w-[137px] w-full'>Connect</Button>
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
