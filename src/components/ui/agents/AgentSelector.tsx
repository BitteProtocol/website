import { RegistryData } from '@/lib/types/agent.types';
import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';
import { Card, CardContent } from '../card';

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
      className='flex flex-row lg:flex-col gap-4 items-center overflow-x-auto disable-scrollbars h-full -mx-6 lg:mx-0 lg:pl-0 pl-6 bg-[#18181A] border border-[#334155] py-3 rounded-md'
      style={{ scrollBehavior: 'smooth', whiteSpace: 'nowrap' }}
    >
      <div className='pt-2 pb-5 px-3 border-b border-[#334155] w-full'>
        <p className='text-[#F8FAFC] font-semibold text-left'>Agents</p>
      </div>
      {agentData?.map((data, i) => (
        <Card
          key={`agents-${i}`}
          className='last:mr-6 lg:last:mr-0 min-w-[307px] h-[76px] flex items-center bg-black border-none cursor-pointer'
          onClick={() => onSelectAgent(data)}
        >
          <CardContent
            className={`text-center p-3 flex items-center gap-3 w-full h-full rounded-md ${selectedAgent?.id == data.id ? 'bg-[#C084FC33] border border-[#C084FC]' : ''} hover:border hover:border-[#C084FC]`}
          >
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
