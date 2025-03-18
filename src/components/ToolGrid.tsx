import { Tool } from '@/lib/types/tool.types';
import Image from 'next/image';

interface ToolGridProps {
  tools: Tool[];
  selectedItems: Set<number>;
  toggleSelection: (index: number) => void;
  loading: boolean;
}

function Spinner() {
  return (
    <div className='flex justify-center py-8'>
      <div className='h-6 w-6 animate-spin rounded-full border-2 border-zinc-800 border-t-zinc-400' />
    </div>
  );
}

export function ToolGrid({
  tools,
  selectedItems,
  toggleSelection,
  loading,
}: ToolGridProps) {
  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
      {tools.map((tool, index) => (
        <div
          key={index}
          onClick={() => toggleSelection(index)}
          className={`p-4 text-left rounded-md min-h-[125px] cursor-pointer flex flex-col ${
            selectedItems.has(index)
              ? 'bg-[#C084FC33] border border-[#C084FC]'
              : 'bg-[#18181A] hover:border hover:border-[#C084FC]'
          }`}
        >
          <div className='flex items-start gap-3 mb-3'>
            <div className='flex-shrink-0 h-[24px] w-[24px] bg-[#2D2D2D] rounded flex items-center justify-center'>
              <Image
                src='/logo.svg'
                alt={tool?.function?.name}
                width={16}
                height={12}
                className='object-contain'
              />
            </div>
            <h2 className='font-medium text-base text-[#F8FAFC]'>
              {tool.function.name}
            </h2>
          </div>

          <p className='text-xs text-zinc-400 mb-3'>
            {tool.function.description}
          </p>

          <div className='flex items-center mt-auto'>
            <span className='text-xs px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 font-semibold'>
              {tool.isPrimitive ? 'Primitive' : 'Tool'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
