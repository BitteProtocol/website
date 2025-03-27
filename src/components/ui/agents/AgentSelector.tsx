import { RegistryData } from '@/lib/types/agent.types';
import { cn } from '@/lib/utils';
import { ArrowUpRight, HelpCircle, Info, SearchIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import InfoTooltip from '../InfoTooltip';
import { Input } from '../input';
import { Switch } from '../switch';

export const AgentSelector = ({
  agentData,
  onSelectAgent,
  selectedAgent,
  isPlayground,
  togglePlayground,
}: {
  agentData: RegistryData[];
  onSelectAgent: (agent: RegistryData) => void;
  selectedAgent: RegistryData | null;
  isPlayground?: boolean;
  togglePlayground: (value: boolean) => void;
}) => {
  const [searchKeyword, setSearchKeyword] = useState('');

  const selectedAgentId = selectedAgent?.id;

  const selectedAgentRef = useRef<HTMLDivElement | null>(null);

  const filteredAgents = searchKeyword.length
    ? agentData?.filter(
        (agent) =>
          agent.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          agent.id.toLowerCase().includes(searchKeyword.toLowerCase())
      )
    : agentData;

  useEffect(() => {
    if (selectedAgentRef.current) {
      selectedAgentRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }
  }, [selectedAgentId, agentData]);

  return (
    <div className='border border-mb-gray-800 bg-mb-black rounded-md h-full flex flex-col'>
      <div className='border-b p-4 border-mb-gray-800'>
        <p className='font-semibold text-white'>Agents</p>
        <p className='text-mb-gray-300 text-sm'>
          Choose agents to perform specific tasks.
        </p>
        <div className='relative mt-2'>
          <SearchIcon
            className='pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground'
            size={18}
          />
          <Input
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder='Search'
            className='pl-8'
          />
        </div>
      </div>
      <div className='flex lg:flex-1 flex-col gap-2 overflow-y-auto py-4 px-4 h-[360px] lg:h-auto'>
        {filteredAgents?.map((agent) => {
          const isSelected = selectedAgentId === agent.id;

          return (
            <div
              key={agent.id}
              ref={isSelected ? selectedAgentRef : null}
              onClick={() => {
                const selectedAgent =
                  selectedAgentId === agent.id
                    ? agentData?.[0] || agent
                    : agent;

                onSelectAgent(selectedAgent);
                sessionStorage.setItem('selectedAgent', JSON.stringify(agent)); // Save to sessionStorage when an agent is selected
              }}
              className={cn(
                'group w-full min-w-[180px] shrink-0 cursor-pointer overflow-hidden rounded-md p-4 border border-transparent',
                isSelected
                  ? 'bg-mb-purple-20 border-mb-purple'
                  : 'bg-mb-black-50 hover:border-mb-purple'
              )}
            >
              <div className='mb-2 flex items-center justify-between gap-2'>
                <div className='flex items-center gap-2'>
                  <Image
                    src={agent?.image || '/logo.svg'}
                    className='object-contain'
                    width={24}
                    height={24}
                    alt={`${agent?.id}-logo`}
                    loading='lazy'
                  />
                  <p className='font-medium transition-all duration-500 text-mb-white-50 text-sm'>
                    {agent.name}
                  </p>
                </div>
                {agent.id !== 'bitte-assistant' ? (
                  <a
                    href={`/agents/${agent.id}`}
                    target='_blank'
                    rel='noreferrer'
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Info size={16} />
                  </a>
                ) : null}
              </div>
              <p className='line-clamp-2 text-sm transition-all duration-500 text-mb-gray-300'>
                {agent.description}
              </p>
            </div>
          );
        })}
      </div>
      <div className='flex items-center justify-between border-t border-mb-gray-800 p-4'>
        <div className='flex items-center gap-2'>
          <Switch checked={isPlayground} onCheckedChange={togglePlayground} />
          <span className='flex items-center gap-1.5 text-sm font-medium'>
            Playground
            <InfoTooltip
              text='Beta agents mode: errors may occur.'
              trigger={<HelpCircle size={16} />}
            />
          </span>
        </div>
        <Link
          href='https://docs.bitte.ai/agents/quick-start'
          target='_blank'
          rel='noopener noreferrer'
          className='flex gap-1 text-sm font-semibold'
        >
          Create Agent
          <ArrowUpRight width={18} height={18} />
        </Link>
      </div>
    </div>
  );
};

export default AgentSelector;
