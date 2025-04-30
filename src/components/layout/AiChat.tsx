'use client';

import { useIsClient } from '@/hooks/useIsClient';
import { BitteAiChat } from '@bitte-ai/chat';
import { useBitteWallet, Wallet } from '@bitte-ai/react';
import { useEffect, useState } from 'react';
import { useAccount, useSendTransaction, useSwitchChain } from 'wagmi';
import ConnectDialog from './ConnectDialog';
import CustomChatSendButton from './CustomChatSendBtn';
import { useWallet as useSuiWallet } from '@suiet/wallet-kit';
import { AiChatProps, getChatProps } from '@/config/chat-options';

const AiChat = ({
  selectedAgent,
  isAgentPage,
  chatId,
  agentsButton,
  prompt,
}: AiChatProps) => {
  const [isConnectModalOpen, setConnectModalOpen] = useState<boolean>(false);
  const [wallet, setWallet] = useState<Wallet | undefined>(undefined);
  const suiWallet = useSuiWallet();
  const { address, isConnected: isEvmConnected } = useAccount();
  const { data: hash, sendTransaction } = useSendTransaction();
  const { switchChain } = useSwitchChain();

  const { selector, isConnected, isWalletSelectorSetup } = useBitteWallet();

  const isClient = useIsClient();
  const isWalletDisconnected =
    !isEvmConnected && !isConnected && !suiWallet.connected;

  useEffect(() => {
    if (!selector) {
      return;
    }

    const fetchWallet = async () => {
      try {
        // Ensure a wallet is selected
        const selectedWalletId = selector.store.getState().selectedWalletId;
        if (!selectedWalletId) {
          console.warn('No wallet selected.');
          return;
        }

        const walletInstance = await selector.wallet();
        if (!walletInstance) {
          return;
        }

        setWallet(walletInstance);
      } catch (error) {
        console.error('Error fetching wallet:', error);
      }
    };

    fetchWallet();
  }, [selector, isConnected, isWalletSelectorSetup]);

  const chatProps = getChatProps({
    selectedAgent,
    wallet,
    address,
    sendTransaction,
    switchChain,
    hash,
    suiWallet,
    isWalletDisconnected,
    isAgentPage,
    chatId,
    agentsButton,
    ConnectDialog,
    setConnectModalOpen,
    isConnectModalOpen,
    CustomChatSendButton,
    prompt,
  });

  return isClient && <BitteAiChat {...chatProps} />;
};

export default AiChat;
