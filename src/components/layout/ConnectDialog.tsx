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
import { Link2 } from 'lucide-react';
import Image from 'next/image';
import React, { Dispatch, SetStateAction } from 'react';
import { Button } from '../ui/button';
import { NearWalletConnector } from './NearWalletSelector';
import { useAppKit } from '@reown/appkit/react';
import ConnectAccountCard from './ConnectAccountCard';

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

  const { open } = useAppKit();

  const content = (
    <div>
      <div className='flex flex-col gap-4 mb-0'>
        <ConnectAccountCard
          action={open}
          icon1='/chains/evm_wallet_connector.svg'
          icon2='/metamask_icon_connect.svg'
          text='EVM Account'
          account='0xd8da6...aa96045'
        />
        <NearWalletConnector setConnectModalOpen={setConnectModalOpen} />
      </div>
      <div className='border-b border-[#334155] my-6'></div>
      <a
        className='w-full bg-[#232323] hover:bg-[#60A5FA4D] h-[69px] sm:h-[61px] flex items-center gap-3 rounded-md p-3 cursor-pointer mt-auto transition-all duration-500 ease-in-out'
        href={MB_URL.BITTE_WALLET_NEW_ACCOUNT}
        target='_blank'
        rel='noreferrer'
      >
        <div className='flex items-center justify-center rounded-md h-[40px] w-[40px] bg-white'>
          <Image
            src='/bitte-symbol-black.svg'
            width={26}
            height={19}
            alt='bitte-connect-logo'
          />
        </div>
        <div>
          <p className='text-sm text-[#F8FAFC] font-semibold mb-2'>
            Create New Account
          </p>
          <p className='text-[#BABDC2] text-xs'>for EVM and NEAR chains</p>
        </div>
      </a>
    </div>
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
          <div className='mb-7 mt-5'>
            <DrawerTitle className='font-semibold text-xl mb-1'>
              Connect Wallet
            </DrawerTitle>
            <p className='text-[#BABDC2] text-xs'>
              Import an existing account or create a new one.
            </p>
          </div>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setConnectModalOpen}>
      <DialogTrigger>
        {sidebarOpen ? (
          <Button className='w-full'>Connect Wallet</Button>
        ) : isSidebar ? (
          <Button size='icon'>
            <Link2 size={16} />
          </Button>
        ) : (
          <Button className='w-[137px]'>Connect</Button>
        )}
      </DialogTrigger>
      <DialogContent className='max-w-[510px] min-h-[415px] border border-[#334155] bg-black rounded-md p-8'>
        <div className='mb-7'>
          <DialogTitle className='font-semibold text-xl mb-1'>
            Connect Wallet
          </DialogTitle>
          <p className='text-[#BABDC2] text-xs w-2/5'>
            Import an existing account or create a new one.
          </p>
        </div>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default ConnectDialog;
