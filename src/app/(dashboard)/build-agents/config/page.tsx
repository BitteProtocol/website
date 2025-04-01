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
import { useWindowSize } from '@/lib/utils/useWindowSize';

export default function ConfigurationPage() {
  const router = useRouter();
  const { toast } = useToast();

  const { width } = useWindowSize();
  const isMobile = !!width && width < 768;

  const [name, setName] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);
  const [selectedTools, setSelectedTools] = useState<Tool[]>([]);
  const [instructions, setInstructions] = useState<string>('');
  const [isCreatingAgent, setIsCreatingAgent] = useState<boolean>(false);

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
          accountId: '',
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
      {/* Header */}
      <div
        className={`${isMobile ? 'px-4' : 'px-6'} py-4 ${!isMobile ? 'border-b border-mb-gray-800' : ''}`}
      >
        <div className='flex items-center justify-between'>
          <div className='space-y-1'>
            <h1 className='font-semibold text-mb-white-50'>Configuration</h1>
            <p className='text-sm text-mb-gray-200'>
              How should your agent use these tools?
            </p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div
        className={`${!isMobile ? 'flex border border-mb-gray-800 rounded-md overflow-hidden flex-1' : 'flex flex-col px-4 py-5 space-y-8 pb-32'}`}
      >
        {!isMobile ? (
          <>
            {/* Left Side - Tools and Editor (Desktop) */}
            <div className='w-1/2 border-r border-mb-gray-800 pl-6 pr-9 py-5 overflow-y-auto scrollbar-thin scrollbar-thumb-mb-gray-600 scrollbar-track-transparent'>
              <div className='h-full flex flex-col'>
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

            {/* Right Side - Name, Image Generator (Desktop) */}
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
                <div>
                  <ImageUploader image={image} setImage={setImage} />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Tools Section (Mobile) */}
            <div className='space-y-6'>
              <SelectedTools selectedTools={selectedTools} />
            </div>

            {/* Prompt Editor Section (Mobile) */}
            <div className='space-y-6'>
              <div className='h-[400px] w-full'>
                <PromptEditor
                  instructions={instructions}
                  setInstructions={setInstructions}
                  selectedTools={selectedTools}
                />
              </div>
            </div>

            {/* Agent Name Section (Mobile) */}
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

            {/* Image Generator Section (Mobile) */}
            <div className='space-y-2'>
              <ImageUploader image={image} setImage={setImage} />
            </div>
          </>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div
        className={`bg-mb-gray-550 px-6 ${isMobile ? 'py-5' : 'py-4'} ${isMobile ? 'fixed bottom-0 left-0 right-0 rounded-t-md' : 'mt-6 rounded-md -mb-11 mt-auto'} flex gap-3 justify-between items-center`}
      >
        <Button
          variant='secondary'
          asChild
          size={isMobile ? 'sm' : 'default'}
          className={`${isMobile ? 'w-full' : 'md:w-[200px]'} bg-secondary text-secondary-foreground hover:text-secondary-foreground hover:bg-secondary/80`}
        >
          <Link href='/build-agents'>Back</Link>
        </Button>
        <Button
          onClick={createAgent}
          disabled={isCreatingAgent || !name.trim()}
          className={isMobile ? 'w-full' : 'md:w-[200px]'}
          size={isMobile ? 'sm' : 'default'}
        >
          {isCreatingAgent ? 'Creating...' : 'Create Agent'}
        </Button>
      </div>

      {/* Loading Overlay */}
      {isCreatingAgent && <LoadingOverlay />}
    </div>
  );
}
