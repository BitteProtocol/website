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
    name: 'Sui Wallet',
    icon: '/sui-logo.png',
    downloadUrl:
      'https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil',
  },
];
