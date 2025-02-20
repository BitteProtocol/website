import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { RegistryData } from '@/lib/types/agent.types';

export default function AgentRow({ agents }: { agents: RegistryData[] }) {
  return (
    <div className='flex gap-4 overflow-x-auto pb-4 px-4'>
      {agents.map((agent) => (
        <Card
          key={agent.name}
          className='flex flex-col min-w-[280px] p-4 bg-black/40 backdrop-blur-sm border-gray-800 hover:bg-black/50 transition-colors cursor-pointer'
        >
          <div className='flex items-start gap-3'>
            <div className='relative w-10 h-10'>
              <Image
                src={agent.coverImage || '/placeholder.svg'}
                alt={`${agent.name} logo`}
                fill
                className='object-contain'
              />
            </div>
            <span className='text-lg font-medium text-white'>{agent.name}</span>
          </div>

          <div className='flex gap-1 mt-3 mb-4'>
            {agent?.networks.map((network, index) => (
              <div
                key={`${agent.name}-${network}-${index}`}
                className='relative w-5 h-5'
              >
                <Image
                  src={network || '/placeholder.svg'}
                  alt='Network icon'
                  fill
                  className='object-contain rounded-full'
                />
              </div>
            ))}
          </div>

          <span className='mt-auto text-sm text-blue-400 hover:text-blue-300 transition-colors'>
            {agent.actionText} →
          </span>
        </Card>
      ))}
    </div>
  );
}
