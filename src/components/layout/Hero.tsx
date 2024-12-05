'use client';

import { Filters as AgentFilters, RegistryData } from '@/lib/types/agent.types';
import { filterHandler } from '@/lib/utils/filters';
import { BitteAiChat, BitteAssistantConfig } from 'bitte-ai-chat';
import { useEffect, useState } from 'react';
import AgentSelector from '../ui/agents/AgentSelector';
import Filters from '../ui/agents/Filters';
import { AgentData } from './Home';

const mockWalletInfo = {
  address: '0x1234567890abcdef',
  balance: '10 ETH',
  accountData: {
    devicePublicKey: 'mockDevicePublicKey',
    accountId: 'mockAccountId',
    isCreated: true,
  },
  isLoading: false,
  isConnected: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  evmAdapter: {} as any, // Add other required properties here
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockWalletConfig = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  network: 'mainnet' as any, // Ensure this matches one of the Network type values
  provider: 'rpc',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  networkConfig: {} as any, // Add appropriate configuration here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  relayer: {} as any, // Add appropriate configuration here
};

const mockColors = {
  generalBackground: '#18181A', // Example value
  messageBackground: '#000000', // Corrected typo and added value
  textColor: '#333333', // Example value
  buttonColor: '#0F172A', // Example value
  borderColor: '#334155', // Example value
};

const Hero = ({ agentData }: { agentData: AgentData }) => {
  const [selectedAgent, setSelectedAgent] = useState<RegistryData | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<AgentFilters[]>([]);

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

  return (
    <section className='w-full'>
      <div className='relative h-full'>
        <video
          autoPlay
          loop
          playsInline
          muted
          className='absolute w-screen h-full object-cover border-b border-[#313E52] opacity-20'
        >
          <source src='/video/brains.mp4' type='video/mp4' />
        </video>
        <div className='flex justify-center flex-col text-center items-center px-8 pt-14 md:pt-12 lg:pt-12 xl:pt-24  2xl:pt-40  py-28'>
          <div className='z-10 md:pointer-events-none max-w-[530px]'>
            <p className='font-semibold text-white text-[32px] md:text-[40px] leading-tight mx-auto '>
              Interact with blockchains using natural language
            </p>
            <p className='text-mb-gray-300 md:text-[22px] font-normal mt-4 leading-tight drop-shadow-2xl'>
              On-chain agent market for transaction building with Universal Safe
              Accounts
            </p>
          </div>
          <div className='mt-20 z-10'>
            <Filters
              filters={agentData?.filters}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterClick}
              isHome
            />
          </div>
          <div className='mt-6 z-10 flex gap-6 h-[500px] w-full 2xl:w-1/3 mx-44'>
            <div className='z-10'>
              <AgentSelector
                agentData={filteredAgents}
                onSelectAgent={setSelectedAgent}
                selectedAgent={selectedAgent}
              />
            </div>
            <div className='w-full'>
              <BitteAiChat
                agentData={
                  {
                    id: selectedAgent?.id,
                    name: selectedAgent?.name,
                    accountId: '',
                    description: selectedAgent?.description,
                    instructions: '',
                    verified: selectedAgent?.verified,
                    image: selectedAgent?.coverImage,
                  } as BitteAssistantConfig
                }
                openAgentSelector={() => null}
                walletInfo={mockWalletInfo}
                walletConfig={mockWalletConfig}
                colors={mockColors}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
