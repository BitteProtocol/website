'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Tool } from '@/lib/types/tool.types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ImageUploader } from '@/components/agent-builder/ImageUploader';
import { LoadingOverlay } from '@/components/agent-builder/LoadingOverlay';
import { PromptEditor } from '@/components/agent-builder/PromptEditor';
import { SelectedTools } from '@/components/agent-builder/SelectedTools';
import { useBitteWallet } from '@bitte-ai/react';
import { useAccount } from 'wagmi';
export default function ConfigurationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);
  const [selectedTools, setSelectedTools] = useState<Tool[]>([]);
  const [instructions, setInstructions] = useState<string>('');
  const [isCreatingAgent, setIsCreatingAgent] = useState<boolean>(false);

  const { activeAccountId } = useBitteWallet();
  const { address } = useAccount();

  // Load selected tools from localStorage on component mount
  useEffect(() => {
    const storedTools = localStorage.getItem('selectedTools');
    if (storedTools) {
      try {
        setSelectedTools(JSON.parse(storedTools));
      } catch (error) {
        console.error('Failed to parse stored tools:', error);
      }
    }
  }, []);

  const createAgent = async () => {
    if (!name.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a name for your agent',
        variant: 'destructive',
      });
      return;
    }
    router.prefetch('/agents/');

    setIsCreatingAgent(true);
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          accountId: activeAccountId || address || '',
          description: 'Custom agent created from tools',
          instructions,
          tools: selectedTools,
          image: image || selectedTools[0]?.image,
          verified: false,
          repo: '',
          generatedDescription: `Agent created with ${selectedTools.length} tools`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create agent');
      }

      const createdAgent = await response.json();
      router.push(`/agents/${createdAgent.id}`);
    } catch (error) {
      setIsCreatingAgent(false);
      console.error('Failed to create agent:', error);
      toast({
        title: 'Error',
        description: 'Failed to create agent. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className='bg-background text-white flex flex-col h-[calc(100vh-124px)]'>
      {/* Desktop Layout */}
      <div className='hidden md:flex md:flex-col md:border md:border-mb-gray-800 md:rounded-md md:h-[90%] md:overflow-hidden'>
        {/* Header */}
        <div className='border-b border-mb-gray-800 px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <h1 className='font-semibold text-mb-white-50'>Configuration</h1>
              <p className='text-sm text-mb-gray-200'>
                How should your agent use these tools?
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Content Area */}
        <div className='flex flex-1 overflow-hidden'>
          {/* Left Side - Tools and Editor */}
          <div className='w-1/2 border-r border-mb-gray-800 pl-6 pr-9 py-5 overflow-y-auto scrollbar-thin scrollbar-thumb-mb-gray-600 scrollbar-track-transparent'>
            <div className='hidden md:block h-full flex flex-col'>
              <SelectedTools selectedTools={selectedTools} />
              <div className='flex-grow h-[calc(100%-120px)] mt-6'>
                <PromptEditor
                  instructions={instructions}
                  setInstructions={setInstructions}
                  selectedTools={selectedTools}
                />
              </div>
            </div>
          </div>

          {/* Right Side - Name, Image Generator, Cover Image */}
          <div className='w-1/2 pl-9 pr-6 py-5 overflow-y-auto scrollbar-thin scrollbar-thumb-mb-gray-600 scrollbar-track-transparent'>
            <div className='space-y-8'>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-mb-white-100'>
                  Agent Name <span className='text-mb-red'>*</span>
                </label>
                <Input
                  className='border-mb-gray-600 text-white focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-mb-gray-500 text-base'
                  placeholder='My Agent'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className='hidden md:block'>
                <ImageUploader image={image} setImage={setImage} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className='md:hidden flex flex-col overflow-x-hidden'>
        {/* Mobile Header */}
        <div className='px-4 py-4'>
          <div className='space-y-1'>
            <h1 className='font-semibold text-mb-white-50'>Configuration</h1>
            <p className='text-sm text-mb-gray-200'>
              How should your agent use these tools?
            </p>
          </div>
        </div>

        {/* Mobile Content */}
        <div className='px-4 py-5 space-y-8 pb-32 w-full max-w-full'>
          {/* Tools Section */}
          <div className='space-y-6'>
            <SelectedTools selectedTools={selectedTools} />
          </div>

          {/* Prompt Editor Section */}
          <div className='space-y-6'>
            <div className='h-[400px] w-full'>
              <PromptEditor
                instructions={instructions}
                setInstructions={setInstructions}
                selectedTools={selectedTools}
              />
            </div>
          </div>

          {/* Agent Name Section */}
          <div className='space-y-2'>
            <label className='text-sm font-medium text-mb-white-100'>
              Agent Name <span className='text-mb-red'>*</span>
            </label>
            <Input
              className='border-mb-gray-600 text-white focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-mb-gray-500 text-base max-w-full'
              placeholder='My Agent'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Image Generator Section */}
          <div className='space-y-2'>
            <ImageUploader image={image} setImage={setImage} />
          </div>
        </div>
      </div>

      {/* Desktop Bottom Action Bar */}
      <div className='hidden md:flex bg-mb-gray-550 px-6 py-4 mt-6 rounded-md -mb-11 justify-between items-center mt-auto'>
        <Button
          variant='secondary'
          asChild
          className='md:w-[200px] bg-secondary text-secondary-foreground hover:text-secondary-foreground hover:bg-secondary/80'
        >
          <Link href='/build-agents'>Back</Link>
        </Button>
        <Button
          onClick={createAgent}
          disabled={isCreatingAgent || !name.trim()}
          className='md:w-[200px]'
        >
          {isCreatingAgent ? 'Creating...' : 'Create Agent'}
        </Button>
      </div>

      {/* Mobile Fixed Bottom Buttons */}
      <div className='md:hidden fixed bottom-0 left-0 right-0 bg-mb-gray-550 px-6 py-5 flex gap-3 justify-between items-center rounded-t-md'>
        <Button
          variant='secondary'
          asChild
          size='sm'
          className='w-full md:w-[120px] bg-secondary text-secondary-foreground hover:text-secondary-foreground hover:bg-secondary/80'
        >
          <Link href='/build-agents'>Back</Link>
        </Button>
        <Button
          onClick={createAgent}
          disabled={isCreatingAgent || !name.trim()}
          className='w-full md:w-[120px]'
          size='sm'
        >
          {isCreatingAgent ? 'Creating...' : 'Create Agent'}
        </Button>
      </div>

      {/* Loading Overlay */}
      {isCreatingAgent && <LoadingOverlay />}
    </div>
  );
}
