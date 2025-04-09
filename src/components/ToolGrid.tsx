import InfoTooltip from '@/components/ui/InfoTooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { Tool } from '@/lib/types/tool.types';
import { mapChainIdsToNetworks } from '@/lib/utils/chainIds';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface ToolGridProps {
  tools: Tool[];
  selectedItems: Set<string>;
  toggleSelection: (toolId: string) => void;
  loading: boolean;
}

function ToolSkeleton() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr'>
      {Array(12)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className='p-4 text-left rounded-md min-h-[125px] bg-mb-black-50 flex flex-col h-full'
          >
            <div className='flex items-start gap-3 mb-3'>
              <Skeleton className='h-[24px] w-[24px] rounded' />
              <Skeleton className='h-5 w-36' />
            </div>

            <Skeleton className='h-3 w-full mb-1' />
            <Skeleton className='h-3 w-4/5 mb-1' />
            <Skeleton className='h-3 w-3/5 mb-3' />

            <div className='flex flex-col gap-2 mt-auto'>
              <Skeleton className='h-5 w-20 rounded-full' />
              <div className='flex gap-2 whitespace-nowrap overflow-hidden'>
                <Skeleton className='h-5 w-24 rounded-full flex-shrink-0' />
                <Skeleton className='h-5 w-24 rounded-full flex-shrink-0 md:inline-flex hidden' />
                <Skeleton className='h-5 w-16 rounded-full flex-shrink-0' />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

// Configuration for pill rendering
const PILL_WIDTH = 120; // Approximate width of a single pill in pixels
const PILL_GAP = 8; // Gap between pills

export function ToolGrid({
  tools,
  selectedItems,
  toggleSelection,
  loading,
}: ToolGridProps) {
  // State to track visible pill counts for each card
  const [visiblePillCounts, setVisiblePillCounts] = useState<number[]>(
    Array(tools.length).fill(1)
  );

  // Refs for container widths
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Initialize container refs array
  useEffect(() => {
    containerRefs.current = containerRefs.current.slice(0, tools.length);
  }, [tools.length]);

  // Calculate pill counts based on container width
  useEffect(() => {
    const updatePillCounts = () => {
      const newCounts = containerRefs.current.map((ref) => {
        if (!ref) return 1;

        const containerWidth = ref.offsetWidth;
        // Account for space needed for container padding, etc.
        const availableWidth = containerWidth - 24; // Subtract padding

        // Calculate how many pills can fit, leaving space for the +X pill if needed
        // First pill is always shown
        let count = 1;
        let usedWidth = PILL_WIDTH;

        // Try to add more pills as long as they fit
        while (usedWidth + PILL_GAP + PILL_WIDTH <= availableWidth) {
          count++;
          usedWidth += PILL_GAP + PILL_WIDTH;
        }

        return count;
      });

      setVisiblePillCounts(newCounts);
    };

    // Initial calculation
    updatePillCounts();

    // Add resize listener to recalculate on window size changes
    window.addEventListener('resize', updatePillCounts);
    return () => window.removeEventListener('resize', updatePillCounts);
  }, [tools.length]);

  if (loading) {
    return <ToolSkeleton />;
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:pb-0 pb-24 auto-rows-fr'>
      {tools.map((tool: Tool, index: number) => {
        const networks = mapChainIdsToNetworks(tool.chainIds || [], true);
        const visibleCount = visiblePillCounts[index] || 1;
        const visibleNetworks = networks.slice(0, visibleCount);
        const remainingCount = networks.length - visibleCount;

        const id = tool.id || tool.function.name;

        return (
          <div
            key={index}
            onClick={() => toggleSelection(id)}
            className={`p-4 text-left rounded-md min-h-[125px] cursor-pointer flex flex-col border ${
              selectedItems.has(id)
                ? 'bg-mb-purple-20 border-mb-purple'
                : 'bg-mb-black-50 border-mb-black-50 hover:border-mb-purple'
            }`}
          >
            <div className='flex items-start gap-3 mb-2'>
              <div className='flex-shrink-0 h-[24px] w-[24px] bg-mb-gray-610 rounded flex items-center justify-center'>
                <Image
                  src={
                    tool.isPrimitive ? '/logo.svg' : tool?.image || '/logo.svg'
                  }
                  alt={tool?.function?.name}
                  width={tool.isPrimitive ? 16 : 24}
                  height={tool.isPrimitive ? 12 : 24}
                  className={`object-contain ${!tool.isPrimitive ? 'rounded' : ''}`}
                />
              </div>
              <h2 className='font-medium text-sm text-mb-white-50 truncate overflow-hidden min-w-0'>
                {tool.function.name}
              </h2>
            </div>

            <p className='text-sm text-mb-gray-200 mb-2 line-clamp-2 overflow-hidden'>
              {tool.function.description}
            </p>

            <div className='flex flex-col gap-2 mt-auto'>
              <span className='text-xs px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 font-semibold w-fit'>
                {tool.isPrimitive ? 'Primitive' : 'Tool'}
              </span>

              <div
                ref={(el) => (containerRefs.current[index] = el)}
                className='flex gap-2 whitespace-nowrap overflow-hidden items-center'
              >
                {visibleNetworks.map((network, i) => (
                  <InfoTooltip
                    key={`${tool.function?.name}-${network.name}-${i}`}
                    text={network.name}
                    delay={130}
                    trigger={
                      <span className='text-xs px-3 py-1 rounded-full bg-zinc-800 text-mb-white-100 font-semibold flex items-center gap-1 cursor-pointer inline-flex flex-shrink-0'>
                        <Image
                          src={network.icon}
                          alt={network.name}
                          width={16}
                          height={16}
                          className='object-contain'
                        />
                        {network.name}
                      </span>
                    }
                  />
                ))}

                {remainingCount > 0 && (
                  <InfoTooltip
                    key={`${tool.function?.name}-more-networks`}
                    text={networks
                      .slice(visibleCount)
                      .map((n) => n.name)
                      .join(', ')}
                    delay={130}
                    trigger={
                      <span className='text-xs px-3 py-1 rounded-full bg-zinc-800 text-mb-white-100 font-semibold flex-shrink-0'>
                        +{remainingCount}
                      </span>
                    }
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
