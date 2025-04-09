import {
  ArrowUpRight,
  Bot,
  TerminalSquare,
  Hammer,
  Server,
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
import { useBitteWallet } from '@bitte-ai/react';
import { generateId } from 'ai';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import ConnectDialog from './layout/ConnectDialog';
import EvmNetworkSelector from './layout/EvmNetworkSelector';
import ManageAccountsDialog from './layout/ManageAccountsDialog';
import { CopyStandard } from './ui/copy/Copy';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isConnectModalOpen, setConnectModalOpen] = useState<boolean>(false);

  const pathname = usePathname();

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
      {
        title: 'MCP (beta)',
        url: `/mcp/${generateId()}`,
        icon: Server,
        isActive: pathname.startsWith('/mcp'),
      },
    ],
    links: [
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
        {activeAccountId || isConnected ? (
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
                      <div className='bg-mb-gray-600 rounded-full py-0.5 px-3 flex items-center gap-2 mb-3 w-fit'>
                        <div className='bg-black p-0.5 rounded'>
                          <Image
                            src='/chains/near_wallet_connector_v2.svg'
                            width={14}
                            height={14}
                            alt='connect-wallet-modal-logo-near'
                          />
                        </div>
                        <span className='text-xs text-mb-white-100 font-normal'>
                          NEAR
                        </span>
                      </div>

                      <span className='text-xs texrt-mb-gray-300 flex items-center gap-3'>
                        <CopyStandard
                          text={activeAccountId}
                          textColor='#CBD5E1'
                          textSize='xs'
                          copySize={14}
                          nopadding
                          isNearAddress
                        />
                      </span>
                    </div>
                    <SidebarSeparator className='bg-mb-black -mx-4' />
                  </>
                ) : null}

                {isConnected && (
                  <>
                    <div className='flex flex-col items-start gap-3'>
                      <EvmNetworkSelector />
                      <CopyStandard
                        text={address as string}
                        textColor='#CBD5E1'
                        textSize='xs'
                        copySize={14}
                        nopadding
                      />
                    </div>
                    <SidebarSeparator className='bg-mb-black -mx-4' />
                  </>
                )}
              </>
            ) : null}
          </div>
        ) : null}
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
