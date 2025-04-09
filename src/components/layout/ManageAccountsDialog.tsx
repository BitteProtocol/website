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
import { User, UserCheck, UserPlus } from 'lucide-react';
import React from 'react';
import { formatEther } from 'viem';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { Button } from '../ui/button';
import ConnectAccountCard from './ConnectAccountCard';
import CurrentlyConnected from './CurrentlyConnected';
import EvmNetworkSelector from './EvmNetworkSelector';
import { NearWalletConnector } from './NearWalletSelector';
import { SuiWalletConnector } from './SuiWalletConnector';
import { ManageAccountsDialogProps } from '@/lib/wallet/types';
import SectionHeader from '../ui/wallet/SectionHeader';
import DialogSection from '../ui/wallet/DialogSection';
import CreateAccountCard from '../ui/wallet/CreateAccountCard';

const ManageAccountsDialog: React.FC<ManageAccountsDialogProps> = ({
  isOpen,
  isConnected,
  isNearConnected,
  isSuiConnected,
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

  const renderConnectedWallets = () => (
    <DialogSection>
      <SectionHeader
        icon={UserCheck}
        title='Currently Connected'
        className={isMobile ? 'mb-4' : ''}
      />

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

        {isSuiConnected && (
          <SuiWalletConnector
            setConnectModalOpen={setConnectModalOpen}
            isManageDialog
          />
        )}
      </div>
    </DialogSection>
  );

  const renderConnectAccounts = () => (
    <DialogSection hasBorder={false}>
      <SectionHeader
        icon={UserPlus}
        title='Connect Accounts'
        className='mb-4'
      />

      <div className='flex flex-col gap-4'>
        {!isConnected && (
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
        )}

        {!isNearConnected && (
          <ConnectAccountCard
            action={[handleSignIn, () => setConnectModalOpen(false)]}
            icon={{ src: '/near_connect_icon.svg' }}
            text='NEAR Account'
            account='blackdragon.near'
          />
        )}

        {!isSuiConnected && (
          <SuiWalletConnector setConnectModalOpen={setConnectModalOpen} />
        )}

        <CreateAccountCard className='mt-auto' />
      </div>
    </DialogSection>
  );

  const dialogContent = (
    <>
      {renderConnectedWallets()}
      {renderConnectAccounts()}
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setConnectModalOpen}>
        <DrawerTrigger asChild>
          <Button
            className='w-full flex items-center gap-2 border border-mb-blue-100 bg-mb-blue-30 text-mb-blue-100'
            aria-label='Manage accounts'
          >
            <User size={16} color='#60A5FA' />
            Accounts
          </Button>
        </DrawerTrigger>
        <DrawerContent className='p-6 border-none'>
          <DrawerTitle className='font-semibold text-xl mt-5'>
            Manage Accounts
          </DrawerTitle>
          {dialogContent}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setConnectModalOpen}>
      <DialogTrigger>
        {sidebarOpen ? (
          <Button
            className='border border-mb-blue-100 bg-mb-blue-30 hover:bg-mb-blue-100/40 w-full text-mb-blue-100 flex items-center gap-1'
            aria-label='Manage accounts'
          >
            <User size={16} color='#60A5FA' /> Connected
          </Button>
        ) : (
          <Button
            variant='outline'
            size='icon'
            className={`border border-mb-blue-100 bg-mb-blue-30 hover:bg-mb-blue-100/40 ${
              isSidebar ? 'h-[32px] w-[32px]' : ''
            }`}
            aria-label='Manage accounts'
          >
            <User size={16} color='#60A5FA' />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='max-w-[510px] p-8 border border-mb-gray-800 bg-black rounded-md'>
        <DialogTitle className='font-semibold text-xl'>
          Manage Accounts
        </DialogTitle>
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
};

export default ManageAccountsDialog;
