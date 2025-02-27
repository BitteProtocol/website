'use client';

import { RegistryData } from '@/lib/types/agent.types';
import {
  BitteAiChat,
  ChatContainerComponentProps,
  InputContainerProps,
  LoadingIndicatorComponentProps,
  MessageGroupComponentProps,
  SendButtonComponentProps,
} from '@bitte-ai/chat';
import { useBitteWallet, Wallet } from '@bitte-ai/react';
import { ArrowUpCircle } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAccount, useSendTransaction, useSwitchChain } from 'wagmi';
import { Button } from '../ui/button';
import ConnectDialog from './ConnectDialog';

const chatColors = {
  generalBackground: '#18181A',
  messageBackground: '#000000',
  textColor: '#FFFFFF',
  buttonColor: '#0F172A',
  borderColor: '#334155',
};
// Custom components
const CustomChatContainer = ({ children }: ChatContainerComponentProps) => (
  <div
    className='rounded-lg shadow-lg border border-white'
    style={{
      position: 'relative',
      height: '100%',
      minHeight: '600px',
    }}
  >
    {children}
  </div>
);

const CustomInputContainer = ({ children }: InputContainerProps) => (
  <div className='p-4 border-t rounded-b-lg backdrop-blur-sm'>{children}</div>
);

const CustomSendButton = ({
  input,
  isLoading,
  buttonColor,
  textColor,
}: SendButtonComponentProps) => (
  <Button
    type='submit'
    disabled={!input || isLoading}
    className='h-10 px-4 transition-all duration-200 ease-in-out'
    style={{
      backgroundColor: buttonColor,
      color: textColor,
      opacity: !input || isLoading ? 0.5 : 1,
    }}
  >
    <ArrowUpCircle className='h-5 w-5 lg:mr-2' />
    <span className='hidden lg:inline'>Send Message</span>
  </Button>
);

const CustomLoadingIndicator = ({
  textColor,
}: LoadingIndicatorComponentProps) => (
  <div
    className='flex items-center justify-center p-4 gap-2'
    style={{ color: textColor }}
  >
    <div
      className='animate-spin rounded-full h-4 w-4 border-b-2'
      style={{ borderColor: textColor }}
    />
    <span className='text-sm font-medium'>Thinking...</span>
  </div>
);

const CustomMessageContainer = ({
  message,
  isUser,
  userName,
  children,
}: MessageGroupComponentProps) => (
  <div className='bg-[#22C55E33]'>
    <div className='p-4 border-b border-white'>
      <div className='flex items-center gap-2'>
        {isUser ? (
          <span className='font-medium'>{userName}</span>
        ) : (
          <span className='font-medium'>{message.agentId}</span>
        )}
      </div>
    </div>
    <div className='p-4'>{children}</div>
  </div>
);

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
  const [wallet, setWallet] = useState<Wallet | undefined>(undefined);
  const [isConnectModalOpen, setConnectModalOpen] = useState<boolean>(false);

  const { selector, isConnected } = useBitteWallet();

  const { address, isConnected: isEvmConnected } = useAccount();
  const { data: hash, sendTransaction } = useSendTransaction();
  const { switchChain } = useSwitchChain();

  const isWalletDisconnected = !isConnected && !isEvmConnected;

  useEffect(() => {
    const getWalletChat = async () => {
      const wallet = await selector.wallet();

      setWallet(wallet);
    };

    if (selector) getWalletChat();
  }, [selector, isConnected]);

  return (
    <BitteAiChat
      options={{
        agentImage: selectedAgent?.coverImage,
        agentName: selectedAgent?.name,
        chatId,
        prompt,
        colors: chatColors,
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
          messageContainer: CustomMessageContainer,
          sendButtonComponent: CustomSendButton,
          chatContainer: CustomChatContainer,
          loadingIndicator: CustomLoadingIndicator,
          inputContainer: CustomInputContainer,
        },
      }}
      wallet={{
        near: {
          wallet: wallet,
        },
        evm: {
          sendTransaction,
          switchChain,
          address,
          hash,
        },
      }}
      agentId={selectedAgent?.id || 'bitte-assistant'}
      apiUrl='/api/chat'
      historyApiUrl='api/history'
    />
  );
};

export default AiChat;
