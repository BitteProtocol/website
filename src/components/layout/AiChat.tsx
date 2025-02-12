'use client';

import { RegistryData } from '@/lib/types/agent.types';
import { BitteAiChat } from '@bitte-ai/chat';
import { useBitteWallet, Wallet } from '@bitte-ai/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAccount, useSendTransaction, useSwitchChain } from 'wagmi';
import ConnectDialog from './ConnectDialog';

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
}: {
  selectedAgent: RegistryData | null;
  isAgentPage?: boolean;
  chatId?: string;
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
      colors={chatColors}
      historyApiUrl='api/history'
      welcomeMessageComponent={
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
        ) : undefined
      }
    />
  );
};

export default AiChat;
