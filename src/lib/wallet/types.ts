import { ReactNode } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { WalletInfo } from './constants';

export interface ManageAccountsDialogProps {
  isOpen: boolean;
  isConnected: boolean;
  isNearConnected: boolean;
  isSuiConnected?: boolean;
  handleSignIn: () => void;
  setConnectModalOpen: Dispatch<SetStateAction<boolean>>;
  sidebarOpen?: boolean;
  isSidebar?: boolean;
}

export interface WalletSelectModalProps {
  wallets: WalletInfo[];
  onClose: () => void;
  onSelectWallet: (walletName: string) => void;
  isWalletInstalled: (walletName: string) => boolean;
  connectionError: string | null;
}

export interface ConnectWalletCardProps {
  action: (() => void) | [() => void, () => void];
  icon: {
    src: string;
    width?: number;
    height?: number;
  };
  text: string;
  account: string;
  disabled?: boolean;
}

export interface WalletDisplayProps {
  address: string;
  networkName: string;
  iconPath: string;
  balance?: number | string;
  onDisconnect?: () => void;
}

export interface WalletConnectorProps {
  setConnectModalOpen?: Dispatch<SetStateAction<boolean>>;
  isManageDialog?: boolean;
}

export interface NetworkBadgeProps {
  networkName: string;
  iconPath: string;
  iconSize?: number;
  className?: string;
}

export interface WalletActionProps {
  onConnect: () => void;
  onDisconnect: () => void;
  isConnected: boolean;
}

export interface ConnectedWalletProps {
  chainIcon: string;
  accountId: string;
  networkBadge: ReactNode;
  network: string;
  balance: string | number;
  action: () => void;
}
