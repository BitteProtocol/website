import * as React from 'react';
import { Bot, TerminalSquare, ArrowUpRight } from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavLinks } from '@/components/nav-links';
import { useState } from 'react';
import { useBitteWallet } from '@bitte-ai/react';
import { useAccount } from 'wagmi';
import {
  Sidebar,
  SidebarMenu,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Image from 'next/image';
import ConnectDialog from './layout/ConnectDialog';
import ManageAccountsDialog from './layout/ManageAccountsDialog';
import { useSidebar } from '@/components/ui/sidebar';

// This is sample data.
const data = {
  navMain: [
    {
      title: 'Chat',
      url: '/chat/3',
      icon: TerminalSquare,
      isActive: true,
    },
    {
      title: 'Browse Agents',
      url: '/agents',
      icon: Bot,
    },
  ],
  links: [
    {
      name: 'Build Agent',
      url: '#',
      icon: ArrowUpRight,
    },
    {
      name: 'Documentation',
      url: '#',
      icon: ArrowUpRight,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isConnectModalOpen, setConnectModalOpen] = useState<boolean>(false);

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
  console.log('OPEN', open);

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Image
              alt='sidebar-logo'
              width={100}
              height={20}
              src='/bitte.svg'
              className='my-6 mx-4'
            />
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
          />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
