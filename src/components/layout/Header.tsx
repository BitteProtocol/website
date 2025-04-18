'use client';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/layout/NavigationMenu';
import { useRedirection } from '@/hooks/useRedirection';
import { BITTE_AGENTID } from '@/lib/agentConstants';
import { communityLinks, developerLinks } from '@/lib/data/navData';
import { MB_URL } from '@/lib/url';
import { cn } from '@/lib/utils';
import { shouldShowHeader } from '@/lib/utils/useShowHeader';
import { useWindowSize } from '@/lib/utils/useWindowSize';
import { useBitteWallet } from '@bitte-ai/react';
import { ArrowUpRight, Menu, Settings, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '../ui/button';
import { Modal } from '../ui/Modal';
import ManageAccountsDialog from './ManageAccountsDialog';
import dynamic from 'next/dynamic';
import { useIsClient } from '@/hooks/useIsClient';
import { useWallet as useSuiWallet } from '@suiet/wallet-kit';
const ConnectDialog = dynamic(() => import('./ConnectDialog'), {
  ssr: false,
});

const Header = () => {
  useRedirection();
  const { width } = useWindowSize();
  const isMobile = !!width && width < 1024;
  const { connected: isSuiConnected } = useSuiWallet();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isConnectModalOpen, setConnectModalOpen] = useState<boolean>(false);

  const { isConnected: isNearConnected, connect } = useBitteWallet();
  const { isConnected } = useAccount();

  const pathname = usePathname();
  const router = useRouter();

  const isClient = useIsClient();

  useEffect(() => {
    // Prefetch the /chat route to make navigation faster
    router.prefetch('/chat');
  }, [router]);

  const handleSignIn = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  if (!shouldShowHeader(pathname)) {
    return;
  }

  if (isMobile && isClient) {
    return (
      <>
        <header className='w-full h-[73px] px-6 md:px-16 border-b border-black flex top-0 justify-between items-center sticky z-50 bg-black backdrop-blur supports-[backdrop-filter]:bg-mb-black/60'>
          <Link href='/' className='flex items-center h-full'>
            <Image
              src='/bitte.svg'
              width={90}
              height={32}
              alt='bitte-mobile-logo'
            />
          </Link>
          {isModalOpen ? (
            <X size={24} color='#FFFFFF' onClick={() => setModalOpen(false)} />
          ) : (
            <Menu
              size={24}
              color='#FFFFFF'
              onClick={() => setModalOpen(true)}
            />
          )}
        </header>

        <Modal isOpen={isModalOpen} closeModal={() => setModalOpen(false)}>
          <div className='flex flex-col gap-7 justify-center border-b border-mb-gray-800 bg-black'>
            <p className='text-[12px] font-semibold text-mb-gray-350 uppercase'>
              Products
            </p>
            <Link
              rel='noopener noreferrer'
              href={`/chat?agentid=${BITTE_AGENTID}`}
              aria-label={`Check out Dev tools`}
            >
              <p className='text-lg text-mb-white-100 font-medium'>AI Chat</p>
              <p className='text-sm text-mb-gray-350'>
                Create transactions chatting with smart contracts.
              </p>
            </Link>
            <Link
              rel='noopener noreferrer'
              target='_blank'
              href={MB_URL.BITTE_WALLET}
              aria-label={`AI Universal Accounts Wallet`}
            >
              <p className='text-lg text-mb-white-100 font-medium'>AI Wallet</p>
              <p className='text-sm text-mb-gray-350'>
                The easiest crypto wallet get started in 30 seconds, non
                custodial and 100% secure.
              </p>
            </Link>
            <Link
              rel='noopener noreferrer'
              href='/agents'
              aria-label={`Check out Dev tools`}
            >
              <p className='text-lg text-mb-white-100 font-medium'>
                Agent Registry
              </p>
              <p className='text-sm text-mb-gray-350'>
                Build cross chain agents.
              </p>
            </Link>
            <Link
              rel='noopener noreferrer'
              target='_blank'
              className='mb-7'
              href='https://mintbase.xyz'
              aria-label={`Check out Mintbase Marketplace`}
            >
              <p className='text-lg text-mb-white-100 font-medium'>
                Marketplace
              </p>
              <p className='text-sm text-mb-gray-350'>
                The easiest crypto wallet get started in 30 seconds, non
                custodial and 100% secure.
              </p>
            </Link>
          </div>
          <div className='flex flex-col gap-7 justify-center border-b border-mb-gray-800 bg-black mt-7'>
            <p className='text-[12px] font-semibold text-mb-gray-350 uppercase'>
              Developers
            </p>
            <div className='grid grid-cols-2 gap-2 mb-7'>
              {developerLinks?.map((devItem, i) => (
                <Link
                  className='mb-white-100 text-sm font-medium mb-4'
                  key={`dev-links-${i}`}
                  rel='noopener noreferrer'
                  target='_blank'
                  href={devItem?.href}
                >
                  {devItem?.title}
                </Link>
              ))}
            </div>
          </div>
          <div className='flex flex-col gap-7 justify-center bg-black mt-7'>
            <p className='text-[12px] font-semibold text-mb-gray-350 uppercase'>
              Community
            </p>
            <div className='grid grid-cols-2 gap-2 mb-7'>
              {communityLinks?.map((communityItem, i) => (
                <Link
                  className='mb-white-100 text-sm font-medium mb-4'
                  key={`community-links-${i}`}
                  rel='noopener noreferrer'
                  target='_blank'
                  href={communityItem?.href}
                >
                  {communityItem?.title}
                </Link>
              ))}
            </div>
          </div>
          <div className='fixed inset-x-0 bottom-0 mt-6 border-t border-gray-200 bg-background p-4 shadow-md md:relative md:border-t-0 md:bg-transparent md:p-0 md:shadow-none'>
            <div className='flex w-full items-center justify-center gap-4'>
              {isNearConnected && (
                <Link
                  href={MB_URL.BITTE_WALLET_SETTINGS}
                  className='w-full'
                  target='_blank'
                >
                  <Button
                    variant='outline'
                    className='block w-full md:hidden'
                    aria-label='Settings'
                  >
                    Settings
                  </Button>
                </Link>
              )}
              {!isConnected && !isNearConnected && !isSuiConnected && (
                <ConnectDialog
                  isOpen={isConnectModalOpen}
                  setConnectModalOpen={setConnectModalOpen}
                />
              )}
              {(isConnected || isNearConnected || isSuiConnected) && (
                <ManageAccountsDialog
                  isOpen={isConnectModalOpen}
                  setConnectModalOpen={setConnectModalOpen}
                  isSuiConnected={isSuiConnected}
                  isConnected={isConnected}
                  isNearConnected={isNearConnected}
                  handleSignIn={handleSignIn}
                />
              )}
            </div>
          </div>
        </Modal>
      </>
    );
  }

  return (
    <>
      <header className='flex w-full h-20 top-0 sticky z-50 bg-black backdrop-blur supports-[backdrop-filter]:bg-mb-black/60'>
        <div className='flex justify-between items-center px-8 content-around h-full w-full'>
          <Link href='/' className='flex h-full'>
            <Image
              src='/bitte.svg'
              alt='bitte-desktop-logo'
              width={120}
              height={24}
            />
          </Link>
          <div className='flex justify-end'>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem className='bg-transparent'>
                  <NavigationMenuLink
                    className={`${navigationMenuTriggerStyle()} gap-1.5 bg-transparent`}
                    rel='noopener noreferrer'
                    href={`/chat?agentid=${BITTE_AGENTID}`}
                  >
                    AI
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem value='products'>
                  <NavigationMenuTrigger className='bg-transparent'>
                    Products
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className='border-zinc-800'>
                    <ul className='grid gap-3 p-4 w-full md:w-[350px]'>
                      <ListItem
                        href={MB_URL.BITTE_WALLET}
                        title='AI Wallet'
                        newTab
                      >
                        Universal accounts that can talk and execute with
                        blockchains.
                      </ListItem>
                      <ListItem href='/registry' title='Agent Registry'>
                        Fork other agents to make them better or bootstrap your
                        own.
                      </ListItem>
                      <ListItem
                        href={MB_URL.MINTBASE_OMNI}
                        title='Marketplace'
                        newTab
                      >
                        Discover, create, and sell NFTs on NEAR.
                      </ListItem>
                      <ListItem
                        href={MB_URL.PAYMASTER}
                        title='Paymaster'
                        newTab
                      >
                        Fund gasless transactions for your community.
                      </ListItem>
                      <ListItem href={MB_URL.DROPS} title='Token Drops' newTab>
                        Create NFT drops with AI or our UI with gasless claiming
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className='bg-transparent'>
                    Developers
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className='border-zinc-800'>
                    <ul className='grid gap-3 p-4 w-full md:w-[205px]'>
                      {developerLinks.map((devs) => (
                        <ListItem
                          key={devs.title}
                          title={devs.title}
                          href={devs.href}
                        />
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem value='community'>
                  <NavigationMenuTrigger className='bg-transparent'>
                    Community
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className='border-zinc-800'>
                    <ul className='grid gap-3 p-4 w-full md:w-[205px]'>
                      {communityLinks.map((community) => (
                        <ListItem
                          key={community.title}
                          title={community.title}
                          href={community.href}
                        />
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem className='bg-transparent'>
                  <NavigationMenuLink
                    className={`${navigationMenuTriggerStyle()} gap-1.5 bg-transparent`}
                    rel='noopener noreferrer'
                    target='_blank'
                    href={MB_URL.AI_DOCS}
                  >
                    Docs <ArrowUpRight size={12} color='#FAFAFA' />
                  </NavigationMenuLink>
                </NavigationMenuItem>
                {!isConnected && !isNearConnected && !isSuiConnected && (
                  <NavigationMenuItem
                    className={`${!isConnected ? 'lg:pr-3' : ''}`}
                    asChild
                  >
                    <ConnectDialog
                      isOpen={isConnectModalOpen}
                      setConnectModalOpen={setConnectModalOpen}
                    />
                  </NavigationMenuItem>
                )}
                {(isConnected || isNearConnected || isSuiConnected) && (
                  <NavigationMenuItem>
                    <ManageAccountsDialog
                      isOpen={isConnectModalOpen}
                      setConnectModalOpen={setConnectModalOpen}
                      isSuiConnected={isSuiConnected}
                      isConnected={isConnected}
                      isNearConnected={isNearConnected}
                      handleSignIn={handleSignIn}
                    />
                  </NavigationMenuItem>
                )}
                {isNearConnected && (
                  <NavigationMenuItem>
                    <Link
                      href={MB_URL.BITTE_WALLET_SETTINGS}
                      className='w-full ml-2'
                      target='_blank'
                    >
                      <Button
                        variant='outline'
                        size='icon'
                        aria-label='Settings'
                      >
                        <Settings className='text-text-primary' size={16} />
                      </Button>
                    </Link>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </header>
    </>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & { newTab?: boolean; href: string }
>(({ className, href, title, children, newTab = false, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          href={href}
          aria-label={`Get more Infos about ${title}`}
          target={newTab ? '_blank' : undefined}
          rel={newTab ? 'noopener noreferrer' : undefined}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-mb-indigo-30 hover:text-accent-foreground focus:bg-mb-indigo-30 focus:text-accent-foreground py-4',
            className
          )}
          {...props}
        >
          <div className='text-sm font-medium leading-none'>{title}</div>
          {children ? (
            <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
              {children}
            </p>
          ) : null}
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

export default Header;
