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
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { communityLinks, developerLinks } from '@/lib/data/navData';
import { MB_URL } from '@/lib/url';
import { cn } from '@/lib/utils';
import { useWindowSize } from '@/lib/utils/useWindowSize';
import { useBitteWallet } from '@mintbase-js/react';
import { DialogTitle } from '@radix-ui/react-dialog';
import { ConnectKitButton } from 'connectkit';
import { ArrowUpRight, Menu, PlusCircle, User, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '../ui/button';
import { Modal } from '../ui/Modal';
import { NearWalletConnector } from './NearWalletSelector';

const Header = () => {
  const { width } = useWindowSize();
  const isMobile = !!width && width < 1024;

  const [isModalOpen, setModalOpen] = useState(false);
  const [isConnectModalOpen, setConnectModalOpen] = useState(false);

  const { isConnected: isNearConnnected } = useBitteWallet();

  const { isConnected } = useAccount();

  console.log('CONNETCIN', isConnected, isNearConnnected);

  return (
    <>
      {!isMobile ? (
        <>
          <header className='flex w-full h-20 border-b border-mb-gray-800 top-0 sticky z-50 bg-black backdrop-blur supports-[backdrop-filter]:bg-mb-black/60'>
            <div className='flex justify-between items-center px-8 content-around h-full w-full'>
              <Link href='/' className='flex h-full'>
                <img
                  src='/bitte.svg'
                  alt='bitte-desktop-logo'
                  width='120px'
                  height='auto'
                />
              </Link>
              <div className='flex justify-end'>
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem value='products'>
                      <NavigationMenuTrigger className='bg-transparent'>
                        Products
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className='grid gap-3 p-4 w-full md:w-[350px]'>
                          <ListItem
                            href={MB_URL.BITTE_WALLET}
                            title='AI Wallet'
                            newTab
                          >
                            Universal accounts that can talk and execute with
                            blockchains.
                          </ListItem>
                          <ListItem
                            href={MB_URL.REGISTRY}
                            title='Agent Registry'
                          >
                            Fork other agents to make them better or bootstrap
                            your own.
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
                          <ListItem
                            href={MB_URL.DROPS}
                            title='Token Drops'
                            newTab
                          >
                            Create NFT drops with AI or our UI with gasless
                            claiming
                          </ListItem>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className='bg-transparent'>
                        Developers
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
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
                      <NavigationMenuContent>
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
                    {!isConnected && !isNearConnnected && (
                      <NavigationMenuItem
                        className={`${!isConnected ? 'lg:pr-3' : ''}`}
                      >
                        {/* <appkit-button label='EVM Connect' /> */}

                        {/* Dialog for desktop */}
                        <Dialog
                          open={isConnectModalOpen}
                          onOpenChange={setConnectModalOpen}
                        >
                          <DialogTrigger>
                            <Button className='min-w-[137px] w-full'>
                              Connect
                            </Button>
                          </DialogTrigger>
                          <DialogContent className='max-w-[510px] min-h-[465px] border border-[#334155] bg-black rounded-md'>
                            <DialogTitle className='font-semibold text-xl'>
                              Connect Wallet
                            </DialogTitle>
                            <div className='flex flex-col gap-4'>
                              <ConnectKitButton.Custom>
                                {({
                                  /* isConnected,
                                  isConnecting,
                                  show,
                                  hide,
                                  address,
                                  ensName,
                                  chain, */ show,
                                }) => {
                                  return (
                                    <div
                                      className='w-full bg-[#141414] h-[80px] flex items-center gap-3 rounded-md p-3 cursor-pointer'
                                      onClick={show}
                                    >
                                      <div className='flex items-center justify-center h-[60px] w-[60px] bg-black rounded-md'>
                                        <Image
                                          src='/chains/evm_wallet_connector.svg'
                                          width={60}
                                          height={60}
                                          alt='connect-wallet-modal-logo-near'
                                        />
                                      </div>
                                      <div>
                                        <p className='text-lg text-[#F8FAFC] font-semibold mb-2'>
                                          EVM Account
                                        </p>
                                        <p className='text-[#BABDC2] text-xs italic'>
                                          e.g.
                                          <span className='ml-2 bg-[#1F1F1F] p-1 rounded-md text-xs text-[#BABDC2] not-italic'>
                                            0xd8da6...aa96045
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  );
                                }}
                              </ConnectKitButton.Custom>

                              <NearWalletConnector
                                setConnectModalOpen={setConnectModalOpen}
                              />
                            </div>
                            <div className='border-b border-[#334155]'></div>
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
                                <p className='text-[#BABDC2] text-xs'>
                                  for EVM and NEAR chains
                                </p>
                              </div>
                            </a>
                          </DialogContent>
                        </Dialog>
                      </NavigationMenuItem>
                    )}
                    {(isConnected || isNearConnnected) && (
                      <NavigationMenuItem>
                        <Dialog
                          open={isConnectModalOpen}
                          onOpenChange={setConnectModalOpen}
                        >
                          <DialogTrigger>
                            <div className='p-3 bg-black rounded-md border border-[#393942]'>
                              <User size={16} />
                            </div>
                          </DialogTrigger>
                          <DialogContent className='max-w-[510px] min-h-[465px] border border-[#334155] bg-black rounded-md'>
                            <DialogTitle className='font-semibold text-xl border-b border-[#334155]'>
                              Manage Accounts
                            </DialogTitle>
                            <p className='text-white font-semibold'>
                              Currently Connected
                            </p>
                            <div className='flex flex-col gap-4'>
                              {isConnected && (
                                <div className='w-full bg-[#141414] h-[80px] flex items-center'>
                                  <appkit-account-button />
                                  <appkit-network-button />
                                </div>
                              )}
                              {isNearConnnected && (
                                <NearWalletConnector
                                  setConnectModalOpen={setConnectModalOpen}
                                />
                              )}
                            </div>
                            <div className='border-b border-[#334155]'></div>
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
                                <p className='text-[#BABDC2] text-xs'>
                                  for EVM and NEAR chains
                                </p>
                              </div>
                            </a>
                          </DialogContent>
                        </Dialog>
                      </NavigationMenuItem>
                    )}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            </div>
          </header>
        </>
      ) : (
        <>
          <header className='w-full h-[73px] px-6 md:px-16 border-b border-mb-gray-800 flex top-0 justify-between items-center sticky z-50 bg-black backdrop-blur supports-[backdrop-filter]:bg-mb-black/60'>
            <Link href='/' className='flex items-center h-full'>
              <img
                src='/bitte.svg'
                alt='bitte-mobile-logo'
                width='100px'
                height='auto'
              />
            </Link>
            {isModalOpen ? (
              <X
                size={24}
                color='#FFFFFF'
                onClick={() => setModalOpen(false)}
              />
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
              <div className='flex items-center'>
                <appkit-button label='EVM Connect' />
                {isConnected && <appkit-network-button />}
              </div>
              <div className='flex'>
                <NearWalletConnector
                  setConnectModalOpen={setConnectModalOpen}
                />
              </div>
              <p className='text-[12px] font-semibold text-mb-gray-350 uppercase'>
                Products
              </p>
              <a
                rel='noopener noreferrer'
                target='_blank'
                href={MB_URL.BITTE_WALLET}
                aria-label={`AI Universal Accounts Wallet`}
              >
                <p className='text-lg text-mb-white-100 font-medium'>
                  AI Wallet
                </p>
                <p className='text-sm text-mb-gray-350'>
                  The easiest crypto wallet get started in 30 seconds, non
                  custodial and 100% secure.
                </p>
              </a>
              <a
                rel='noopener noreferrer'
                target='_blank'
                href={MB_URL.REGISTRY}
                aria-label={`Check out Dev tools`}
              >
                <p className='text-lg text-mb-white-100 font-medium'>
                  Agent Registry
                </p>
                <p className='text-sm text-mb-gray-350'>
                  Build cross chain agents.
                </p>
              </a>
              <a
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
              </a>
            </div>
            <div className='flex flex-col gap-7 justify-center border-b border-mb-gray-800 bg-black mt-7'>
              <p className='text-[12px] font-semibold text-mb-gray-350 uppercase'>
                Developers
              </p>
              <div className='grid grid-cols-2 gap-2 mb-7'>
                {developerLinks?.map((devItem, i) => (
                  <a
                    className='mb-white-100 text-sm font-medium mb-4'
                    key={`dev-links-${i}`}
                    rel='noopener noreferrer'
                    target='_blank'
                    href={devItem?.href}
                  >
                    {devItem?.title}
                  </a>
                ))}
              </div>
            </div>
            <div className='flex flex-col gap-7 justify-center bg-black mt-7'>
              <p className='text-[12px] font-semibold text-mb-gray-350 uppercase'>
                Community
              </p>
              <div className='grid grid-cols-2 gap-2 mb-7'>
                {communityLinks?.map((communityItem, i) => (
                  <a
                    className='mb-white-100 text-sm font-medium mb-4'
                    key={`community-links-${i}`}
                    rel='noopener noreferrer'
                    target='_blank'
                    href={communityItem?.href}
                  >
                    {communityItem?.title}
                  </a>
                ))}
              </div>
            </div>
            <div className='w-full'>
              {/* Drawer for mobile */}
              <Drawer
                open={isConnectModalOpen}
                onOpenChange={setConnectModalOpen}
              >
                <DrawerTrigger asChild>
                  <Button
                    onClick={() => setConnectModalOpen(true)}
                    className='w-full'
                  >
                    Connect
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerOverlay />
                  {/* Connect buttons inside the drawer */}
                  <appkit-button label='EVM Connect' />
                  <NearWalletConnector
                    setConnectModalOpen={setConnectModalOpen}
                  />
                </DrawerContent>
              </Drawer>
            </div>
          </Modal>
        </>
      )}
    </>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & { newTab?: boolean }
>(({ className, title, children, newTab = false, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          aria-label={`Get more Infos about ${title}`}
          target={newTab ? '_blank' : undefined}
          rel={newTab ? 'noopener noreferrer' : undefined}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#414D7D40] hover:text-accent-foreground focus:bg-[#414D7D40] focus:text-accent-foreground py-4',
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
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

export default Header;
