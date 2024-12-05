import Image from 'next/image';
import { Card, CardContent } from '../card';
import { Dispatch, SetStateAction } from 'react';
import { RegistryData } from '@/lib/types/agent.types';

export const AgentSelector = ({
  agentData,
  onSelectAgent,
  selectedAgent,
}: {
  agentData: RegistryData[];
  onSelectAgent: Dispatch<SetStateAction<RegistryData | null>>;
  selectedAgent: RegistryData | null;
}) => {
  return (
    <div
      className='flex flex-col itmes-center gap-3 max-w-[100vw] max-h-[600px] overflow-x-auto disable-scrollbars mb-3'
      style={{ scrollBehavior: 'auto' }}
    >
      {agentData?.map((data, i) => (
        <Card
          key={`agents-${i}`}
          className={`min-w-[307px] h-[76px] flex items-center ${selectedAgent?.id == data.id ? 'bg-[#C084FC33] border border-[#C084FC]' : 'bg-[#18181A]'} cursor-pointer`}
          onClick={() => onSelectAgent(data)}
        >
          <CardContent className='text-center p-3 flex items-center gap-3'>
            <div>
              <Image
                src={data?.coverImage || '/bitte-symbol-black.svg'}
                className={`object-contain max-h-[56px] max-w-[160px] min-h-[40px] ${!data?.coverImage ? 'bg-white' : ''}`}
                width={56}
                height={56}
                alt={`${data?.id}-logo`}
                loading='lazy'
              />
            </div>
            <div className='font-medium text-[#F8FAFC]'>{data?.name}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AgentSelector;
