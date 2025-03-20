import { Tool } from '@/lib/types/tool.types';

interface SelectedToolsProps {
  selectedTools: Tool[];
}

export function SelectedTools({ selectedTools }: SelectedToolsProps) {
  return (
    <div className='mb-6'>
      <h2 className='text-sm font-medium mb-2'>Tools</h2>
      <div className='flex flex-wrap gap-2'>
        {selectedTools.map((tool, index) => (
          <div
            key={index}
            className='bg-zinc-800 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2'
          >
            {tool.function.name}
          </div>
        ))}
      </div>
    </div>
  );
}
