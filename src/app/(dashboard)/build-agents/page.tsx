'use client';

import { ToolGrid } from '@/components/ToolGrid';
import Filters from '@/components/ui/agents/Filters';
import { Button } from '@/components/ui/button';
import {
  CommandMenu,
  type CommandMenuGroup,
} from '@/components/ui/command-menu';
import { useFilters } from '@/hooks/useFilters';
import { Filters as AgentFilters } from '@/lib/types/agent.types';
import { Tool } from '@/lib/types/tool.types';
import { filterHandler } from '@/lib/utils/filters';
import { ListFilter, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

export default function BuildAgents() {
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFilters, setSelectedFilters] = useState<AgentFilters[]>([]);

  const handleFilterClick = (value: string, label: string) => {
    setSelectedFilters((prevFilters) =>
      filterHandler(prevFilters, value, label)
    );
  };

  const clearFilters = () => {
    setSelectedFilters([]);
  };

  // Use empty array to get only Networks filter
  const filters = useFilters([]);

  const groups: CommandMenuGroup[] = [
    {
      heading: 'Tools',
      items: tools.map((tool, index) => ({
        icon: (
          <img
            src={tool?.image || 'bitte-symbol-black.svg'}
            alt={tool?.function?.name}
            className='h-4 w-4'
          />
        ),
        label: tool.function.name,
        action: () => toggleSelection(index),
        metadata: tool.isPrimitive ? 'Primitive' : 'Tool',
      })),
    },
  ];

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await fetch('/api/tools');
        const data = await response.json();
        setTools(data);
      } catch (error) {
        console.error('Failed to fetch tools:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  const toggleSelection = (index: number) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleNextStep = () => {
    router.prefetch('/build-agents/config');
    const selectedToolsData = Array.from(selectedItems).map(
      (index) => tools[index]
    );
    localStorage.setItem('selectedTools', JSON.stringify(selectedToolsData));
    router.push('/build-agents/config');
  };

  const filteredTools = tools.filter((tool) => {
    if (!tool) return false;

    const matchesFilters = selectedFilters.every((filter) => {
      if (filter.label === 'Networks') {
        if (!tool.chainIds || tool.chainIds.length === 0) {
          return filter.values.some((value) => value.id === '0');
        }
        return filter.values.some((value) =>
          tool.chainIds?.some((chainId) => value.id === chainId.toString())
        );
      }
      return true;
    });

    return matchesFilters;
  });

  return (
    <div className='bg-background text-white flex flex-col h-[calc(100vh-124px)]'>
      <CommandMenu groups={groups} />

      {/* Main Container - Only for Desktop */}
      <div className='hidden md:flex md:flex-col md:border md:border-[#334155] md:rounded-md md:h-[90%] md:overflow-hidden'>
        {/* Header */}
        <div className='px-6 py-4 md:border-b md:border-[#334155]'>
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <h1 className='font-semibold text-[#F8FAFC]'>Available Tools</h1>
              <p className='text-sm text-zinc-400'>
                Combine tools to create agents
              </p>
            </div>
            <p className='hidden md:block text-sm text-zinc-400'>
              <kbd className='rounded-md border border-zinc-800 bg-zinc-900 px-2 py-0.5'>
                ⌘
              </kbd>{' '}
              +{' '}
              <kbd className='rounded-md border border-zinc-800 bg-zinc-900 px-2 py-0.5'>
                K
              </kbd>{' '}
              to open command menu
            </p>
          </div>
        </div>

        {/* Desktop Content Area with Filters and Grid */}
        <div className='hidden md:flex md:flex-1 md:overflow-hidden'>
          {/* Desktop Filter Sidebar */}
          <div className='w-64 border-r border-[#334155] px-4 py-5 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent'>
            <div className=''>
              <div className='flex items-start justify-between'>
                <h2 className='text-xs font-semibold text-mb-silver'>
                  Filters
                </h2>
                <Button
                  variant='ghost'
                  onClick={clearFilters}
                  className={`${selectedFilters?.length ? 'visible' : 'invisible'} text-xs`}
                >
                  Clear
                </Button>
              </div>
            </div>

            <div className=''>
              <Filters
                filters={filters}
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterClick}
              />
            </div>
          </div>

          {/* Desktop Main Content */}
          <div className='flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent px-6 py-5'>
            <ToolGrid
              tools={filteredTools}
              selectedItems={selectedItems}
              toggleSelection={toggleSelection}
              loading={loading}
            />
          </div>
        </div>
      </div>

      {/* Mobile Header - Outside Container */}
      <div className='md:hidden px-2 py-4'>
        <div className='space-y-1'>
          <h1 className='font-semibold text-[#F8FAFC]'>Available Tools</h1>
          <p className='text-sm text-zinc-400'>
            Combine tools to create agents
          </p>
        </div>
      </div>

      {/* Mobile Filters Dialog */}
      <div className='md:hidden'>
        <Dialog>
          <DialogTrigger className='w-full'>
            <div className='flex flex-1 items-center gap-2 border-y border-[#334155] w-full p-4'>
              <ListFilter className='h-5 w-5' />
              Filters
            </div>
          </DialogTrigger>
          <DialogContent className='h-full bg-background p-0'>
            <DialogHeader className='text-left w-full h-auto flex flex-col'>
              <div className='border-b border-[#334155] p-6 bg-[#18181A] w-full'>
                <DialogTitle>Filters</DialogTitle>
              </div>
              <div className='pt-0 lg:pt-4 p-4 h-[70vh] overflow-scroll'>
                <Filters
                  filters={filters}
                  selectedFilters={selectedFilters}
                  onFilterChange={handleFilterClick}
                  isMobile
                />
              </div>
            </DialogHeader>
            <DialogFooter className='bg-background'>
              <DialogClose className='py-4 px-6 border-t border-[#334155] w-full'>
                <div className='flex gap-4 w-full items-center'>
                  <Button
                    type='button'
                    variant='secondary'
                    className='w-full'
                    onClick={clearFilters}
                  >
                    Clear
                  </Button>
                  <Button type='button' variant='default' className='w-full'>
                    Apply
                  </Button>
                </div>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Mobile Content */}
      <div className='md:hidden px-2 py-5'>
        <ToolGrid
          tools={filteredTools}
          selectedItems={selectedItems}
          toggleSelection={toggleSelection}
          loading={loading}
        />
      </div>

      {/* Desktop Next Button */}
      <div className='hidden md:flex bg-zinc-900 p-6 mt-6 rounded-md -mb-11 justify-end items-center mt-auto'>
        <Button
          onClick={handleNextStep}
          className='md:w-[200px]'
          disabled={selectedItems.size === 0}
        >
          Next
        </Button>
      </div>

      {/* Mobile Fixed Bottom Button */}
      <div className='md:hidden fixed bottom-0 left-0 right-0 bg-zinc-900 px-6 py-5 flex justify-end rounded-t-md'>
        <Button
          onClick={handleNextStep}
          className='w-[177px]'
          size='sm'
          disabled={selectedItems.size === 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
