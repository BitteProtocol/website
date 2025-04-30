import {
  CustomToolComponent,
  PortfolioData,
  SendButtonComponentProps,
  SwapFTData,
  TokenList,
  TransferFTData,
} from '@bitte-ai/chat';
import { RegistryData } from '@/lib/types/agent.types';
import { Dispatch, SetStateAction } from 'react';
import WelcomeMessage from '@/components/layout/WelcomeMessage';
import { Wallet } from '@bitte-ai/react';
import { WalletContextState } from '@suiet/wallet-kit';
import { SendTransactionMutate, SwitchChainMutate } from 'wagmi/query';
import { Config } from 'wagmi';

interface ConnectDialogProps {
  isOpen: boolean;
  setConnectModalOpen: Dispatch<SetStateAction<boolean>>;
  isWelcomeMessage?: boolean;
}

export interface AiChatProps {
  selectedAgent: RegistryData | null;
  isAgentPage?: boolean;
  chatId?: string;
  agentsButton?: JSX.Element;
  prompt?: string;
}

export interface ChatOptionsProps {
  selectedAgent: RegistryData | null;
  chatId?: string;
  prompt?: string;
  isWalletDisconnected: boolean;
  isAgentPage?: boolean;
  agentsButton?: JSX.Element;
  ConnectDialog: React.ComponentType<ConnectDialogProps>;
  setConnectModalOpen: Dispatch<SetStateAction<boolean>>;
  isConnectModalOpen: boolean;
  CustomChatSendButton: React.ComponentType<SendButtonComponentProps>;
}

export type ChatProps = ChatOptionsProps & {
  wallet: Wallet | undefined;
  address: `0x${string}` | undefined;
  sendTransaction: SendTransactionMutate<Config, unknown>;
  switchChain: SwitchChainMutate<Config, unknown>;
  hash: `0x${string}` | undefined;
  suiWallet: WalletContextState;
};

// Chat theme colors
export const chatColors = {
  generalBackground: '#18181A',
  messageBackground: '#000000',
  textColor: '#FFFFFF',
  buttonColor: '#0F172A',
  borderColor: '#334155',
};

// Custom tool components configuration
const customToolComponents: CustomToolComponent[] = [
  {
    name: 'get-portfolio',
    component: ({
      data,
    }: {
      data: PortfolioData | TransferFTData | SwapFTData;
    }) => {
      if ('portfolioValue' in data) {
        return <TokenList data={data} />;
      }
      return null;
    },
  },
];

// Get chat options based on props
const getChatOptions = ({
  selectedAgent,
  chatId,
  prompt,
  isWalletDisconnected,
  isAgentPage,
  agentsButton,
  ConnectDialog,
  setConnectModalOpen,
  isConnectModalOpen,
  CustomChatSendButton,
}: ChatOptionsProps) => {
  return {
    agentImage: selectedAgent?.image || '/logo.svg',
    agentName: selectedAgent?.name,
    chatId,
    prompt,
    colors: chatColors,
    mcpServerUrl: process.env.NEXT_PUBLIC_MCP_SERVER_URL,
    customComponents: {
      welcomeMessageComponent:
        isWalletDisconnected && !isAgentPage ? (
          <WelcomeMessage
            ConnectDialog={ConnectDialog}
            isConnectModalOpen={isConnectModalOpen}
            setConnectModalOpen={setConnectModalOpen}
          />
        ) : undefined,
      mobileInputExtraButton: agentsButton,
      sendButtonComponent: CustomChatSendButton,
    },
  };
};

export const getChatProps = ({
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
}: ChatProps) => {
  return {
    customToolComponents,
    options: getChatOptions({
      selectedAgent,
      chatId,
      prompt,
      isWalletDisconnected,
      isAgentPage,
      agentsButton,
      ConnectDialog,
      setConnectModalOpen,
      isConnectModalOpen,
      CustomChatSendButton,
    }),
    wallet: {
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
    },
    agentId: selectedAgent?.id || 'bitte-assistant',
    apiUrl: '/api/chat',
    historyApiUrl: 'api/history',
  };
};
