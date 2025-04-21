'use client';

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
import { useWindowSize } from '@/lib/utils/useWindowSize';
import { useAppKit } from '@reown/appkit/react';
import { Link2 } from 'lucide-react';
import React, { Dispatch, SetStateAction } from 'react';
import { Button } from '../ui/button';
import ConnectAccountCard from './ConnectAccountCard';
import { NearWalletConnector } from './NearWalletSelector';
import { useIsClient } from '@/hooks/useIsClient';
import { SuiWalletConnector } from './SuiWalletConnector';

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
  const isClient = useIsClient();

  const content = (
    <div>
      <div className='flex flex-col gap-4 mb-0'>
        <ConnectAccountCard
          action={open}
          icon={{
            src: '/chains/evm_metamask_connector.svg',
            width: 80,
            height: 80,
          }}
          text='EVM Account'
          account='0xd8da6...aa96045'
        />
        <NearWalletConnector setConnectModalOpen={setConnectModalOpen} />
        <SuiWalletConnector setConnectModalOpen={setConnectModalOpen} />
      </div>
    </div>
  );

  if (isMobile && isClient) {
    return (
      <Drawer open={isOpen} onOpenChange={setConnectModalOpen}>
        <DrawerTrigger asChild>
          <Button
            onClick={() => setConnectModalOpen(true)}
            className={`${isWelcomeMessage ? 'w-[137px]' : 'w-full'}`}
            aria-label='Connect wallet'
          >
            Connect
          </Button>
        </DrawerTrigger>
        <DrawerContent className='p-6 border-none'>
          <div className='mb-7 mt-5'>
            <DrawerTitle className='font-semibold text-xl mb-1'>
              Connect Wallet
            </DrawerTitle>
            <p className='text-mb-gray-50 text-xs'>
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
      <DialogTrigger asChild>
        {sidebarOpen ? (
          <Button className='w-full' aria-label='Connect wallet'>
            Connect Wallet
          </Button>
        ) : isSidebar ? (
          <Button size='icon'>
            <Link2 size={16} />
          </Button>
        ) : (
          <Button className='w-[137px]' aria-label='Connect wallet'>
            Connect
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='max-w-[510px] min-h-[415px] border border-mb-gray-800 bg-black rounded-md p-8'>
        <div className='mb-7'>
          <DialogTitle className='font-semibold text-xl mb-1'>
            Connect Wallet
          </DialogTitle>
          <p className='text-mb-gray-50 text-xs w-2/5'>
            Import an existing account or create a new one.
          </p>
        </div>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default ConnectDialog;
