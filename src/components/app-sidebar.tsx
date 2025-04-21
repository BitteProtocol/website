import {
  ArrowUpRight,
  Bot,
  FlaskConical,
  Hammer,
  TerminalSquare,
} from 'lucide-react';
import * as React from 'react';

import { NavLinks } from '@/components/nav-links';
import { NavMain } from '@/components/nav-main';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import { BITTE_AGENTID } from '@/lib/agentConstants';
import { MB_URL } from '@/lib/url';
import { useBitteWallet } from '@bitte-ai/react';
import { useWallet } from '@suiet/wallet-kit';
import { generateId } from 'ai';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import ConnectDialog from './layout/ConnectDialog';
import EvmNetworkSelector from './layout/EvmNetworkSelector';
import ManageAccountsDialog from './layout/ManageAccountsDialog';
import WalletAddress from './ui/wallet/WalletAddress';
import WalletBadge from './ui/wallet/WalletBadge';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isConnectModalOpen, setConnectModalOpen] = useState<boolean>(false);

  const pathname = usePathname();

  const { isConnected, address: ethAddress } = useAccount();
  const { connected: isSuiConnected, account: suiAccount } = useWallet();

  const {
    isConnected: isNearConnected,
    connect,
    activeAccountId,
  } = useBitteWallet();

  const { open } = useSidebar();

  const data = {
    navMain: [
      {
        title: 'Chat',
        url: `/chat/${generateId()}?agentid=${BITTE_AGENTID}`,
        icon: TerminalSquare,
        isActive: pathname.startsWith('/chat'),
      },
      {
        title: 'Browse Agents',
        url: '/agents',
        icon: Bot,
        isActive: pathname.startsWith('/agents'),
      },
      {
        title: 'Build Agents',
        url: '/build-agents',
        icon: Hammer,
        isActive: pathname.startsWith('/build-agents'),
      },
      ...(isConnected || isSuiConnected || isNearConnected
        ? [
            {
              title: 'My Agents',
              url: '/my-agents',
              icon: FlaskConical,
              isActive: pathname.startsWith('/my-agents'),
            },
          ]
        : []),
    ],
    links: [
      {
        name: 'Documentation',
        url: MB_URL.DEV_DOCS,
        icon: ArrowUpRight,
      },
    ],
  };

  const handleSignIn = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {open ? (
              <Link href='/'>
                <Image
                  alt='sidebar-logo'
                  width={100}
                  height={20}
                  src='/bitte.svg'
                  className='my-6 mx-4'
                />
              </Link>
            ) : (
              <div className='h-[32px] w-[32px] rounded-md bg-black m-auto flex items-center justify-center mt-4'>
                <Link href='/'>
                  <Image
                    alt='sidebar-logo-closed'
                    width={27}
                    height={20}
                    src='/logo.svg'
                  />
                </Link>
              </div>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavLinks links={data.links} />
      </SidebarContent>
      <SidebarFooter className='p-4 w-full'>
        {activeAccountId || isConnected || isSuiConnected ? (
          <div className='flex flex-col gap-4 mb-4'>
            {open ? (
              <>
                <span className='text-[10px] text-mb-silver font-semibold'>
                  Accounts & Network
                </span>
                <SidebarSeparator className='bg-mb-black -mx-4' />

                {activeAccountId ? (
                  <>
                    <div>
                      <WalletBadge
                        networkName='NEAR'
                        iconPath='/chains/near_wallet_connector_v2.svg'
                        className='mb-3'
                      />

                      <WalletAddress
                        address={activeAccountId}
                        isNearAddress={true}
                      />
                    </div>
                    <SidebarSeparator className='bg-mb-black -mx-4' />
                  </>
                ) : null}

                {isConnected && (
                  <>
                    <div className='flex flex-col items-start gap-3'>
                      <EvmNetworkSelector />
                      <WalletAddress address={ethAddress as string} />
                    </div>
                    <SidebarSeparator className='bg-mb-black -mx-4' />
                  </>
                )}

                {isSuiConnected && suiAccount && (
                  <>
                    <div>
                      <WalletBadge
                        networkName='SUI'
                        iconPath='/sui-logo.png'
                        className='mb-3'
                      />

                      <WalletAddress address={suiAccount.address} />
                    </div>
                    <SidebarSeparator className='bg-mb-black -mx-4' />
                  </>
                )}
              </>
            ) : null}
          </div>
        ) : null}
        {!isConnected && !isNearConnected && !isSuiConnected && (
          <ConnectDialog
            isOpen={isConnectModalOpen}
            setConnectModalOpen={setConnectModalOpen}
            isSidebar
            sidebarOpen={open}
          />
        )}
        {(isConnected || isNearConnected || isSuiConnected) && (
          <ManageAccountsDialog
            isOpen={isConnectModalOpen}
            setConnectModalOpen={setConnectModalOpen}
            isConnected={isConnected}
            isNearConnected={isNearConnected}
            isSuiConnected={isSuiConnected}
            handleSignIn={handleSignIn}
            sidebarOpen={open}
            isSidebar
          />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
