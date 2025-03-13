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
import { User, UserCheck, UserPlus } from 'lucide-react';
import Image from 'next/image';
import React, { Dispatch, SetStateAction } from 'react';
import { formatEther } from 'viem';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { Button } from '../ui/button';
import { NearWalletConnector } from './NearWalletSelector';
import CurrentlyConnected from './CurrentlyConnected';
import EvmNetworkSelector from './EvmNetworkSelector';
import ConnectAccountCard from './ConnectAccountCard';
import { useAppKit } from '@reown/appkit/react';

/* const getChainSvgPath = (chainId?: number): string => {
  const defaultSVG = '/chains/evm_wallet_connector.svg';
  if (!chainId) return defaultSVG;
  const chainSvgMap: { [key: number]: string } = {
    1: '/chains/new_eth.svg',
    10: '/chains/new_op.svg',
    42161: '/chains/new_arbi.svg',
    8453: '/chains/new_base.svg',
    137: '/chains/new_polygon.svg',
    100: '/chains/new_gnosis.svg',
    43114: '/chains/avax.svg',
  };

  return chainSvgMap[chainId] || defaultSVG;
}; */

interface ManageAccountsDialogProps {
  isOpen: boolean;
  isConnected: boolean;
  isNearConnected: boolean;
  handleSignIn: () => void;
  setConnectModalOpen: Dispatch<SetStateAction<boolean>>;
  sidebarOpen?: boolean;
  isSidebar?: boolean;
}

const ManageAccountsDialog: React.FC<ManageAccountsDialogProps> = ({
  isOpen,
  isConnected,
  isNearConnected,
  handleSignIn,
  setConnectModalOpen,
  sidebarOpen,
  isSidebar,
}) => {
  const { width } = useWindowSize();
  const isMobile = !!width && width < 1024;

  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });

  const { open } = useAppKit();

  const content = (
    <>
      <div className='border-b border-[#334155] -mx-8 my-5'></div>
      <div className={`flex items-center gap-2 ${isMobile ? 'mb-4' : ''}`}>
        <UserCheck size={16} color='#BABDC2' />
        <p className='text-[#BABDC2] font-medium text-xs'>
          Currently Connected
        </p>
      </div>
      <div className='flex flex-col gap-6'>
        {isNearConnected && (
          <NearWalletConnector setConnectModalOpen={setConnectModalOpen} />
        )}
        {isConnected && (
          <CurrentlyConnected
            chainIcon='/chains/evm_wallet_connector.svg'
            accountId={address as string}
            networkBadge={<EvmNetworkSelector />}
            network={balance?.symbol || ''}
            balance={
              balance?.value
                ? Number(formatEther(balance?.value)).toFixed(4)
                : 0.0
            }
            action={disconnect}
          />
        )}
      </div>
      <div className='border-b border-[#334155] my-5 -mx-8'></div>
      <div>
        <div className='flex items-center gap-2 mb-4'>
          <UserPlus size={16} color='#BABDC2' />
          <p className='text-[#BABDC2] font-medium text-xs'>Connect Accounts</p>
        </div>
        <div className='flex flex-col gap-4'>
          {!isConnected && (
            <ConnectAccountCard
              action={open}
              icon1='/chains/evm_wallet_connector.svg'
              icon2='/metamask_icon_connect.svg'
              text='EVM Account'
              account='0xd8da6...aa96045'
            />
          )}
          {!isNearConnected && (
            <ConnectAccountCard
              action={[handleSignIn, () => setConnectModalOpen(false)]}
              icon1='/near_connect_icon.svg'
              text='NEAR Account'
              account='blackdragon.near'
            />
          )}
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
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setConnectModalOpen}>
        <DrawerTrigger asChild>
          <Button className='w-full flex items-center gap-2 border border-[#60A5FA] bg-[#60A5FA4D] text-[#60A5FA]'>
            <User size={16} color='#60A5FA' />
            Accounts
          </Button>
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
        {sidebarOpen ? (
          <Button className='border border-[#60A5FA] bg-[#60A5FA4D] hover:bg-[#60A5FA]/40 w-full text-[#60A5FA] flex items-center gap-1'>
            <User size={16} color='#60A5FA' /> Connected
          </Button>
        ) : (
          <Button
            variant='outline'
            size='icon'
            className={`border border-[#60A5FA] bg-[#60A5FA4D] hover:bg-[#60A5FA]/40 ${isSidebar ? 'h-[32px] w-[32px]' : ''}`}
          >
            <User size={16} color='#60A5FA' />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='max-w-[510px] p-8 border border-[#334155] bg-black rounded-md'>
        <DialogTitle className='font-semibold text-xl'>
          Manage Accounts
        </DialogTitle>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default ManageAccountsDialog;
