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

  const { isConnected: isNearConnected, connect } = useBitteWallet();

  const handleSignIn = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const { isConnected } = useAccount();

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
