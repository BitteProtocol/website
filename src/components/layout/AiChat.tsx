// @ts-ignore

'use client';

import { useIsClient } from '@/hooks/useIsClient';
import { RegistryData } from '@/lib/types/agent.types';
import { BitteAiChat } from '@bitte-ai/chat';
import { useBitteWallet, Wallet } from '@bitte-ai/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAccount, useSendTransaction, useSwitchChain } from 'wagmi';
import ConnectDialog from './ConnectDialog';
import CustomChatSendButton from './CustomChatSendBtn';
import { useWallet as useSuiWallet } from '@suiet/wallet-kit';

const chatColors = {
  generalBackground: '#18181A',
  messageBackground: '#000000',
  textColor: '#FFFFFF',
  buttonColor: '#0F172A',
  borderColor: '#334155',
};

const AiChat = ({
  selectedAgent,
  isAgentPage,
  chatId,
  agentsButton,
  prompt,
}: {
  selectedAgent: RegistryData | null;
  isAgentPage?: boolean;
  chatId?: string;
  agentsButton?: JSX.Element;
  prompt?: string;
}) => {
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

  return (
    isClient && (
      <BitteAiChat
        options={{
          agentImage: selectedAgent?.image || '/logo.svg',
          agentName: selectedAgent?.name,
          chatId,
          prompt,
          colors: chatColors,
          mcpServerUrl: process.env.NEXT_PUBLIC_MCP_SERVER_URL,
          customComponents: {
            welcomeMessageComponent:
              isWalletDisconnected && !isAgentPage ? (
                <div className='flex flex-col gap-4 items-center justify-center absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center w-full'>
                  <Image
                    alt='bitte-ai-logo'
                    className='mx-auto mb-4'
                    width={40}
                    height={28}
                    src='/logo.svg'
                  />
                  <div className='mb-8 text-[20px] font-medium text-gray-40'>
                    Execute Transactions with AI
                  </div>
                  <ConnectDialog
                    isOpen={isConnectModalOpen}
                    setConnectModalOpen={setConnectModalOpen}
                    isWelcomeMessage
                  />
                </div>
              ) : undefined,
            mobileInputExtraButton: agentsButton,
            sendButtonComponent: CustomChatSendButton,
          },
        }}
        wallet={{
          near: {
            wallet,
          },
          evm: {
            sendTransaction,
            switchChain,
            address,
            hash,
          },
          sui: {
            wallet: suiWallet,
          },
        }}
        agentId={selectedAgent?.id || 'bitte-assistant'}
        apiUrl='/api/chat'
        historyApiUrl='api/history'
      />
    )
  );
};

export default AiChat;
