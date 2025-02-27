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
import { formatEther } from 'viem';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { Button } from '../ui/button';
import { NearWalletConnector } from './NearWalletSelector';

const getChainSvgPath = (chainId?: number): string => {
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
};

const shortenAddress = (address?: string) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

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

  const { address, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });

  const content = (
    <>
      <div className='border-b border-[#334155] my-6'></div>
      <div className={`flex items-center gap-2 ${isMobile ? 'mb-4' : ''}`}>
        <UserCheck size={20} />
        <p className='text-white font-semibold'>Currently Connected</p>
      </div>
      <div className='flex flex-col gap-4'>
        {isConnected && (
          <div className='flex gap-2 items-center justify-between flex-wrap'>
            <div className='flex items-center gap-2'>
              <Image
                src={getChainSvgPath(chainId)}
                width={46}
                height={46}
                alt='connected-evm-chain'
              />
              <div>
                <p> {shortenAddress(address)}</p>
                <small>
                  {balance?.value
                    ? Number(formatEther(balance?.value)).toFixed(4)
                    : 0.0}{' '}
                  {balance?.symbol}
                </small>
              </div>
            </div>
            <div className='flex gap-4'>
              <appkit-network-button />
              <Button onClick={() => disconnect()}>Disconnect</Button>
            </div>
          </div>
        )}
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
          {!isConnected && (
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
          )}
          {!isNearConnected && (
            <div className='w-full bg-[#141414] h-[80px] flex items-center gap-3 rounded-md p-3'>
              <div className='flex items-center justify-center h-[60px] w-[60px] bg-black rounded-md'>
                <Image
                  src='/chains/near_wallet_connector_v2.svg'
                  width={46}
                  height={46}
                  alt='connect-wallet-modal-logo-near'
                />
              </div>
              <div>
                <div
                  className='connect-chain-button'
                  onClick={() => {
                    handleSignIn();
                    setConnectModalOpen(false);
                  }}
                >
                  NEAR Account
                </div>

                <p className='text-[#BABDC2] text-xs italic'>
                  e.g.
                  <span className='ml-2 bg-[#1F1F1F] p-1 rounded-md text-xs text-[#BABDC2] not-italic'>
                    blackdragon.near
                  </span>
                </p>
              </div>
            </div>
          )}
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
      <DialogContent className='max-w-[510px] min-h-[465px] border border-[#334155] bg-black rounded-md'>
        <DialogTitle className='font-semibold text-xl'>
          Manage Accounts
        </DialogTitle>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default ManageAccountsDialog;
