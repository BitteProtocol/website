'use client';

import { BitteAiChat } from '@bitte-ai/chat';
import '@bitte-ai/chat/style.css';
import { useBitteWallet, Wallet } from '@mintbase-js/react';
import { useEffect, useState } from 'react';
import { useAccount, useSendTransaction, useSwitchChain } from 'wagmi';

import { AgentData } from '@/components/layout/Home';
import AgentSelector from '@/components/ui/agents/AgentSelector';
import Filters from '@/components/ui/agents/Filters';
import { Filters as AgentFilters, RegistryData } from '@/lib/types/agent.types';
import { MB_URL } from '@/lib/url';
import { cn } from '@/lib/utils';
import { filterHandler } from '@/lib/utils/filters';
import Link from 'next/link';
import { Button } from '../ui/button';
import ConnectDialog from './ConnectDialog';

const chatColors = {
  generalBackground: '#18181A',
  messageBackground: '#000000',
  textColor: '#FFFFFF',
  buttonColor: '#0F172A',
  borderColor: '#334155',
};

const Hero = ({ agentData }: { agentData: AgentData }) => {
  const [selectedAgent, setSelectedAgent] = useState<RegistryData | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<AgentFilters[]>([]);

  const [wallet, setWallet] = useState<Wallet | undefined>(undefined);
  const [isConnectModalOpen, setConnectModalOpen] = useState<boolean>(false);

  const { selector, isConnected } = useBitteWallet();

  const { address, isConnected: isEvmConnected } = useAccount();
  const { data: hash, sendTransaction } = useSendTransaction();
  const { switchChain } = useSwitchChain();

  const filteredAgents = selectedFilters?.length
    ? agentData.agents.filter((agent) => {
        if (!agent) return false;

        return selectedFilters.every((filter) => {
          if (filter.label === 'Category' && agent.category) {
            return filter.values.includes(agent.category);
          }
          return true;
        });
      })
    : agentData.agents;

  const isWalletDisconnected = !isConnected && !isEvmConnected;

  const handleFilterClick = (value: string, label: string) => {
    setSelectedFilters((prevFilters) =>
      filterHandler(prevFilters, value, label)
    );
  };

  useEffect(() => {
    if (agentData.agents.length) {
      setSelectedAgent(agentData.agents[0]);
    }
  }, [agentData]);

  useEffect(() => {
    const getWalletChat = async () => {
      const wallet = await selector.wallet();

      setWallet(wallet);
    };

    if (selector) getWalletChat();
  }, [selector, isConnected]);

  useEffect(() => {
    // Retrieve the selected agent from sessionStorage when the component mounts
    const storedAgent = sessionStorage.getItem('selectedAgent');
    if (storedAgent) {
      setSelectedAgent(JSON.parse(storedAgent));
    }
  }, []);

  useEffect(() => {
    // Save the selected agent to sessionStorage whenever it changes
    if (selectedAgent) {
      sessionStorage.setItem('selectedAgent', JSON.stringify(selectedAgent));
    }
  }, [selectedAgent]);

  return (
    <section className='w-full'>
      <div className='relative'>
        {isWalletDisconnected ? (
          <video
            autoPlay
            loop
            playsInline
            muted
            className='absolute w-screen h-full object-cover border-b border-[#313E52] opacity-20'
          >
            <source src='/video/brains.mp4' type='video/mp4' />
          </video>
        ) : null}
        <div
          className={cn(
            'flex justify-center flex-col text-center items-center px-8 py-28',
            isWalletDisconnected
              ? 'pt-14 md:pt-12 lg:pt-12 xl:pt-24 2xl:pt-40'
              : 'pt-4'
          )}
        >
          {isWalletDisconnected ? (
            <div className='z-10 md:pointer-events-none'>
              <p className='font-semibold text-white text-[32px] md:text-[40px] leading-tight mx-auto '>
                What transaction can we help you with?
              </p>
            </div>
          ) : null}
          <div className='mt-10 z-10 flex flex-col w-full '>
            <div className='-mx-8 lg:-mx-0'>
              <Filters
                filters={agentData?.filters}
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterClick}
                isHome
              />
            </div>
          </div>

          <div className='mt-6 z-10 flex flex-col lg:flex-row gap-6 h-[700px] lg:h-[500px] 2xl:h-[800px] w-full 2xl:w-4/5'>
            <div className='z-10 -mx-8 lg:-mx-0'>
              <AgentSelector
                agentData={filteredAgents}
                onSelectAgent={setSelectedAgent}
                selectedAgent={selectedAgent}
              />
            </div>
            <div className='lg:w-full h-full -mx-8 lg:-mx-0'>
              <BitteAiChat
                options={{
                  agentImage: selectedAgent?.coverImage,
                  agentName: selectedAgent?.name,
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
                  // solana: {
                  //   connection,
                  //   provider: walletProvider
                  // }
                }}
                agentId={selectedAgent?.id || 'bitte-assistant'}
                apiUrl='/api/chat'
                colors={chatColors}
                historyApiUrl='api/history'
                welcomeMessageComponent={
                  !isConnected && !isEvmConnected ? (
                    <div className='flex flex-col gap-4 items-center justify-center absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center w-full'>
                      <img
                        className='mx-auto mb-4'
                        width={40}
                        height={28}
                        src={'/logo.svg'}
                      />
                      <div className='mb-8 text-[20px] font-medium text-gray-40'>
                        Execute Transactions with AI
                      </div>
                      <ConnectDialog
                        isOpen={isConnectModalOpen}
                        setConnectModalOpen={setConnectModalOpen}
                      />
                    </div>
                  ) : undefined
                }
              />
            </div>
          </div>
          <div className='mt-11 flex items-center justify-center gap-3 md:gap-6 z-10'>
            <Link href='/registry'>
              <Button variant='secondary' className='w-full md:w-[200px]'>
                Browse Agents
              </Button>
            </Link>
            <Button asChild variant='secondary' className='w-full md:w-[200px]'>
              <Link href={MB_URL.DEV_DOCS} target='_blank'>
                Build Chain Agent
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
