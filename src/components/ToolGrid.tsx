import { Skeleton } from '@/components/ui/skeleton';
import { Tool } from '@/lib/types/tool.types';
import Image from 'next/image';

interface ToolGridProps {
  tools: Tool[];
  selectedItems: Set<number>;
  toggleSelection: (index: number) => void;
  loading: boolean;
}

function ToolSkeleton() {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
      {Array(12)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className='p-4 text-left rounded-md min-h-[125px] bg-[#18181A] flex flex-col'
          >
            <div className='flex items-start gap-3 mb-3'>
              <Skeleton className='h-[24px] w-[24px] rounded' />
              <Skeleton className='h-5 w-36' />
            </div>

            <Skeleton className='h-3 w-full mb-1' />
            <Skeleton className='h-3 w-4/5 mb-1' />
            <Skeleton className='h-3 w-3/5 mb-3' />

            <div className='flex items-center mt-auto'>
              <Skeleton className='h-5 w-20 rounded-full' />
            </div>
          </div>
        ))}
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
    return <ToolSkeleton />;
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
      {tools.map((tool, index) => (
        <div
          key={index}
          onClick={() => toggleSelection(index)}
          className={`p-4 text-left rounded-md min-h-[125px] cursor-pointer flex flex-col border border-[#18181A] ${
            selectedItems.has(index)
              ? 'bg-[#C084FC33] border-[#C084FC]'
              : 'bg-[#18181A] hover:border-[#C084FC]'
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
