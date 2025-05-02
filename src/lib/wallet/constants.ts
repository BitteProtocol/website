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
    name: 'Slush — A Sui wallet',
    icon: '/slush-wallet.png',
    downloadUrl:
      'https://chromewebstore.google.com/detail/slush-%E2%80%94-a-sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil',
  },
];
