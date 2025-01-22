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
import { PlusCircle, User, UserCheck, UserPlus } from 'lucide-react';
import Image from 'next/image';
import React, { Dispatch, SetStateAction } from 'react';
import { EvmAccount } from './evm/EvmAccount';
import { EvmConnectWallet } from './evm/EvmConnectAccount';
import { NearWalletConnector } from './NearWalletSelector';

interface ManageAccountsDialogProps {
  isOpen: boolean;
  isConnected: boolean;
  isNearConnected: boolean;
  handleSignIn: () => void;
  setConnectModalOpen: Dispatch<SetStateAction<boolean>>;
}

const ManageAccountsDialog: React.FC<ManageAccountsDialogProps> = ({
  isOpen,
  isConnected,
  isNearConnected,
  handleSignIn,
  setConnectModalOpen,
}) => {
  const { width } = useWindowSize();
  const isMobile = !!width && width < 1024;

  const content = (
    <>
      <div className='border-b border-[#334155] my-6'></div>
      <div className={`flex items-center gap-2 ${isMobile ? 'mb-4' : ''}`}>
        <UserCheck size={20} />
        <p className='text-white font-semibold'>Currently Connected</p>
      </div>
      <div className='flex flex-col gap-4'>
        {isConnected && <EvmAccount />}
        {isNearConnected && (
          <NearWalletConnector setConnectModalOpen={setConnectModalOpen} />
        )}
      </div>
      <div className='border-b border-[#334155] my-9'></div>
      <div>
        <div className='flex items-center gap-2 mb-7'>
          <UserPlus size={20} />
          <p className='text-white font-semibold'>Add Accounts</p>
        </div>
        <div className='flex flex-col gap-4'>
          <EvmConnectWallet />
          <div
            className='w-full bg-[#141414] h-[80px] flex items-center gap-3 rounded-md p-3 cursor-pointer'
            onClick={() => {
              handleSignIn();
              setConnectModalOpen(false);
            }}
          >
            <div className='flex items-center justify-center h-[60px] w-[60px] bg-black rounded-md'>
              <Image
                src='/wallets/near_wallet_connector_v2.svg'
                width={46}
                height={46}
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
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setConnectModalOpen}>
        <DrawerTrigger asChild>
          <div className='p-3 bg-black rounded-md border border-[#393942]'>
            <User size={16} color='#FAFAFA' />
          </div>
        </DrawerTrigger>
        <DrawerContent className='p-6 border-none'>
          <DrawerTitle className='font-semibold text-xl mt-5'>
            Manage Accounts
          </DrawerTitle>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setConnectModalOpen}>
      <DialogTrigger>
        <div className='p-3 bg-black rounded-md border border-[#393942]'>
          <User size={16} color='#FAFAFA' />
        </div>
      </DialogTrigger>
      <DialogContent className='max-w-[485px] min-h-[465px] border border-[#334155] bg-black rounded-md'>
        <DialogTitle className='font-semibold text-xl'>
          Manage Accounts
        </DialogTitle>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default ManageAccountsDialog;
