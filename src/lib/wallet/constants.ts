export interface WalletInfo {
  name: string;
  icon: string;
  downloadUrl: string;
}

export const SUI_WALLETS: WalletInfo[] = [
  {
    name: 'Phantom',
    icon: '/phantom.svg',
    downloadUrl: 'https://phantom.app/',
  },
  {
    name: 'Slush',
    icon: '/slush-wallet.png',
    downloadUrl: 'https://slush.app',
  },
];
