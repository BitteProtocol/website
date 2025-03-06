import { ArrowUpRight, Bot, TerminalSquare } from 'lucide-react';
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
  useSidebar,
} from '@/components/ui/sidebar';
import { useBitteWallet } from '@bitte-ai/react';
import { generateId } from 'ai';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import ConnectDialog from './layout/ConnectDialog';
import ManageAccountsDialog from './layout/ManageAccountsDialog';
import { usePathname } from 'next/navigation';
import { CopyStandard } from './ui/copy/Copy';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isConnectModalOpen, setConnectModalOpen] = useState<boolean>(false);

  const pathname = usePathname();

  const data = {
    navMain: [
      {
        title: 'Chat',
        url: `/chat/${generateId()}`,
        icon: TerminalSquare,
        isActive: pathname.startsWith('/chat/'),
      },
      {
        title: 'Browse Agents',
        url: '/agents',
        icon: Bot,
        isActive: pathname.startsWith('/agents'),
      },
    ],
    links: [
      {
        name: 'Build Agent',
        url: 'https://docs.bitte.ai/agents/quick-start',
        icon: ArrowUpRight,
      },
      {
        name: 'Documentation',
        url: 'https://docs.bitte.ai/',
        icon: ArrowUpRight,
      },
    ],
  };

  const {
    isConnected: isNearConnected,
    connect,
    activeAccountId,
  } = useBitteWallet();

  const handleSignIn = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const { isConnected, address } = useAccount();

  const { open } = useSidebar();

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
                    src='/bitte_stars_white_sidebar.png'
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
        <div className='flex flex-col gap-6 mb-9'>
          <span className='text-[10px] text-[#B2B2B3] font-semibold'>
            Accounts & Network
          </span>

          {activeAccountId ? (
            <div>
              <div className='bg-[#27272A] rounded-full py-1 px-3 flex items-center w-[100px] gap-2 mb-3'>
                <div className='bg-black p-1 rounded-md'>
                  <Image
                    src='/chains/near_wallet_connector_v2.svg'
                    width={16}
                    height={16}
                    alt='connect-wallet-modal-logo-near'
                  />
                </div>
                <span className='text-xs text-[#FAFAFA] font-semibold'>
                  NEAR
                </span>
              </div>

              <span className='text-xs texrt-[#CBD5E1] flex items-center gap-3'>
                <CopyStandard
                  text={activeAccountId}
                  textColor='#CBD5E1'
                  textSize='xs'
                  copySize={14}
                  nopadding
                />
              </span>
            </div>
          ) : null}
          {isConnected && (
            <div className='flex flex-col items-start gap-3'>
              <appkit-network-button />
              <CopyStandard
                text={address as string}
                textColor='#CBD5E1'
                textSize='xs'
                copySize={14}
                nopadding
              />
            </div>
          )}
        </div>
        {!isConnected && !isNearConnected && (
          <ConnectDialog
            isOpen={isConnectModalOpen}
            setConnectModalOpen={setConnectModalOpen}
            isSidebar
            sidebarOpen={open}
          />
        )}
        {(isConnected || isNearConnected) && (
          <ManageAccountsDialog
            isOpen={isConnectModalOpen}
            setConnectModalOpen={setConnectModalOpen}
            isConnected={isConnected}
            isNearConnected={isNearConnected}
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
