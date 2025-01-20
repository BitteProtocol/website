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
    <div className='flex flex-row lg:flex-col gap-4 items-center overflow-x-auto disable-scrollbars h-full lg:bg-[#18181A] lg:border lg:border-[#334155] lg:rounded-md lg:p-6 scroll-smooth whitespace-nowrap'>
      {agentData?.map((data, i) => (
        <Card
          key={`agents-${i}`}
          className='first:ml-6 lg:first:ml-0 last:mr-6 lg:last:mr-0 min-w-[219px] lg:min-w-[307px] h-[76px] flex items-center bg-black border-none cursor-pointer'
          onClick={() => {
            onSelectAgent(data);
            sessionStorage.setItem('selectedAgent', JSON.stringify(data)); // Save to sessionStorage when an agent is selected
          }}
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
            <div className='font-medium text-[#F8FAFC] break-words w-full overflow-hidden text-ellipsis'>
              {data?.name}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AgentSelector;
