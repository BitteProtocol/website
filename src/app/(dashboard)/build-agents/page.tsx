'use client';

import { Tool } from '@/lib/types/tool.types';
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  CommandMenu,
  type CommandMenuGroup,
} from '@/components/ui/command-menu';
import { ToolGrid } from '@/components/ToolGrid';
import { AgentSetupDialog } from '@/components/AgentSetupDialog';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function BuildAgents() {
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [instructions, setInstructions] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isCreatingAgent, setIsCreatingAgent] = useState<boolean>(false);

  const groups: CommandMenuGroup[] = [
    {
      items: [
        {
          icon: <Plus className='h-4 w-4' />,
          label: 'Add Tool',
          action: () => console.log('Add Tool clicked'),
        },
      ],
    },
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
    if (selectedItems.size === 0) {
      alert('Please select at least one tool');
      return;
    }

    // Store selected tools in localStorage
    const selectedToolsData = Array.from(selectedItems).map(
      (index) => tools[index]
    );
    localStorage.setItem('selectedTools', JSON.stringify(selectedToolsData));

    // Navigate to configuration page
    router.push('/build-agents/config');
  };

  const handleCreateAgent = () => {
    if (selectedItems.size === 0) {
      alert('Please select at least one tool');
      return;
    }

    if (!instructions.trim()) {
      alert('Please provide instructions for your agent');
      return;
    }

    setIsDialogOpen(true);
  };

  const handleAgentCreated = (agentId: string) => {
    window.location.href = `https://www.bitte.ai/agents/${agentId}`;
  };

  const handleAgentError = (error: Error) => {
    setIsCreatingAgent(false);
    console.error('Error creating agent:', error);
    alert('Failed to create agent. Please try again.');
  };

  const handleDialogClose = (open: boolean) => {
    if (!open && !isCreatingAgent) {
      setIsDialogOpen(false);
    }
  };

  console.log('TOOLS', tools);

  return (
    <div className='bg-background text-white flex flex-col'>
      <CommandMenu groups={groups} />
      <div className='overflow-hidden flex flex-col border border-[#334155] rounded-md h-[84vh]'>
        {/* Header - Spans the full width */}
        <div className='border-b border-[#334155] px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <h1 className='font-semibold text-[#F8FAFC]'>Available Tools</h1>
              <p className='text-sm text-zinc-400'>
                Combine tools to create agents
              </p>
            </div>
            <p className='text-sm text-zinc-400'>
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

        {/* Content Area with Filters and Grid */}
        <div className='flex overflow-hidden m-5 rounded-md'>
          {/* Filter Sidebar */}
          <div className='w-64 border-r border-[#334155] p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent'>
            <div className='py-2'>
              <h2 className='text-lg font-medium mb-4'>Filters</h2>
            </div>

            <div className='space-y-6'>
              {/* Playground Toggle */}
              <div className='flex items-center justify-between mb-4'>
                <span className='text-sm'>Playground</span>
                <div className='w-10 h-5 bg-zinc-800 rounded-full relative'>
                  <div className='w-4 h-4 rounded-full bg-zinc-500 absolute left-0.5 top-0.5'></div>
                </div>
              </div>

              {/* Categories */}
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <h3 className='text-sm text-zinc-400'>Categories</h3>
                  <svg
                    width='12'
                    height='8'
                    viewBox='0 0 12 8'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M1 1.5L6 6.5L11 1.5'
                      stroke='#71717A'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
                <div className='space-y-2 ml-2'>
                  {['Open Source', 'DeFi', 'NFTs', 'Staking', 'Trading'].map(
                    (category) => (
                      <div key={category} className='flex items-center'>
                        <div className='w-4 h-4 rounded border border-zinc-700 mr-2'></div>
                        <span className='text-sm'>{category}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Networks */}
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <h3 className='text-sm text-zinc-400'>Networks</h3>
                  <svg
                    width='12'
                    height='8'
                    viewBox='0 0 12 8'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M1 1.5L6 6.5L11 1.5'
                      stroke='#71717A'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
                <div className='space-y-2 ml-2'>
                  {[
                    { name: 'Ethereum', icon: '📃' },
                    { name: 'Near', icon: 'N' },
                    { name: 'Bitcoin', icon: '₿' },
                    { name: 'Base', icon: 'B' },
                    { name: 'Polygon', icon: 'P' },
                    { name: 'Optimism', icon: 'O' },
                  ].map((network) => (
                    <div key={network.name} className='flex items-center'>
                      <div className='w-4 h-4 rounded border border-zinc-700 mr-2'></div>
                      <span className='text-sm mr-2'>{network.icon}</span>
                      <span className='text-sm'>{network.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className='flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent p-4'>
            <ToolGrid
              tools={tools}
              selectedItems={selectedItems}
              toggleSelection={toggleSelection}
              loading={loading}
            />
          </div>
        </div>
      </div>

      <div className='bg-zinc-900 p-6 mt-3 rounded-md -mb-6 h-[9vh] flex justify-end items-center'>
        <Button onClick={handleNextStep} className='md:w-[200px]'>
          Next
        </Button>
      </div>

      <AgentSetupDialog
        isOpen={isDialogOpen}
        onOpenChange={handleDialogClose}
        selectedTools={Array.from(selectedItems).map((index) => tools[index])}
        instructions={instructions}
        onSuccess={handleAgentCreated}
        onError={handleAgentError}
        setIsCreatingAgent={setIsCreatingAgent}
      />

      {isCreatingAgent && (
        <div className='fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center'>
          <LoadingOverlay />
          <div className='text-center mt-4'>
            <h3 className='text-xl font-medium text-white'>
              Creating your agent
            </h3>
            <p className='text-zinc-400'>
              Assembling tools and configuring capabilities...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
