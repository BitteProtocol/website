'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImagePlus, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect, useMemo } from 'react';
import { Tool } from '@/lib/types/tool.types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { NotionLikeEditor } from '@/components/NotionLikeEditor';

export default function ConfigurationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');
  const [selectedTools, setSelectedTools] = useState<Tool[]>([]);
  const [instructions, setInstructions] = useState<string>('');
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide an image prompt',
        variant: 'destructive',
      });
      return;
    }

    if (imagePrompt.length < 10) {
      toast({
        title: 'Error',
        description: 'Prompt must be at least 10 characters',
        variant: 'destructive',
      });
      return;
    }

    setIsGeneratingImage(true);
    try {
      const response = await fetch(
        `/api/generate-image?prompt=${encodeURIComponent(imagePrompt)}`
      );
      if (!response.ok) throw new Error('Failed to generate image');
      const data = await response.json();
      setImage(data.url);
    } catch (error) {
      console.error('Failed to generate image:', error);
      toast({
        title: 'Error',
        description:
          'Failed to generate image. Please try uploading one instead.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const createAgent = async () => {
    if (!name.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a name for your agent',
        variant: 'destructive',
      });
      return;
    }

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
      router.push(`https://www.bitte.ai/agents/${createdAgent.id}`);
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

  const handleGoBack = () => {
    router.push('/build-agents');
  };

  // Default content for the editor
  const defaultInstructions = useMemo(() => {
    const toolsList = selectedTools
      .map(
        (tool) => `
<h3>${tool.function.name}</h3>
<p>[When and how to use this tool]</p>`
      )
      .join('\n');

    return `<h1>Agent Instructions</h1>

<h2>🎯 Goal & Responsibilities</h2>
<ul>
<li>[What should this agent accomplish?]</li>
<li>[What are its main tasks?]</li>
</ul>

<h2>🛠️ Tools</h2>
${toolsList}

<h2>💬 Personality & Communication</h2>
<ul>
<li>[How should the agent interact and communicate?]</li>
<li>[What tone and style should it use?]</li>
</ul>

<h2>⚠️ Limitations</h2>
<ul>
<li>[What should the agent NOT do?]</li>
<li>[Any specific restrictions?]</li>
</ul>`;
  }, [selectedTools]);

  useEffect(() => {
    if (!instructions) {
      setInstructions(defaultInstructions);
    }
  }, [defaultInstructions]);

  return (
    <div className='bg-background text-white flex flex-col'>
      <div className='overflow-hidden flex flex-col border border-[#334155] rounded-md h-[84vh]'>
        {/* Header */}
        <div className='border-b border-[#334155] px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <h1 className='font-semibold text-[#F8FAFC]'>Configuration</h1>
              <p className='text-sm text-zinc-400'>
                How should your agent use these tools?
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className='flex overflow-hidden m-5 rounded-md'>
          {/* Left Side - Tools and Editor */}
          <div className='w-1/2 border-r border-[#334155] p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent'>
            {/* Selected Tools */}
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

            {/* Prompt Editor */}
            <div>
              <h2 className='text-sm font-medium mb-2'>Prompt</h2>
              <div className='border border-mb-gray-600 rounded-md overflow-hidden bg-zinc-900 h-[calc(100%-5rem)]'>
                <NotionLikeEditor
                  content={instructions}
                  onChange={setInstructions}
                  placeholder='Describe how your agent should behave...'
                />
              </div>
              <p className='text-xs text-zinc-500 mt-2'>Markdown accepted.</p>
            </div>
          </div>

          {/* Right Side - Name, Image Generator, Cover Image */}
          <div className='w-1/2 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent'>
            <div className='space-y-8'>
              {/* Agent Name */}
              <div className='space-y-2'>
                <label className='text-sm font-medium text-mb-white-100'>
                  Agent Name
                </label>
                <Input
                  className='bg-zinc-900 border-zinc-800 text-white focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-zinc-700'
                  placeholder='My Agent'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Generate Image */}
              <div className='space-y-3'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-mb-white-100'>
                    Generate Image
                  </label>
                </div>

                <div className='flex items-center gap-3'>
                  <Input
                    className='bg-zinc-900 border-zinc-800 text-white focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-zinc-700'
                    placeholder='Details of your image'
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                  />
                  <Button
                    variant='secondary'
                    onClick={handleGenerateImage}
                    disabled={isGeneratingImage}
                    className='w-full sm:w-auto whitespace-nowrap'
                  >
                    {isGeneratingImage ? 'Generating...' : 'Generate'}
                  </Button>
                </div>
              </div>

              {/* Cover Image */}
              <div className='space-y-3'>
                <label className='text-sm font-medium text-mb-white-100'>
                  Cover Image
                </label>
                <div className='h-[200px] w-full'>
                  {!image ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={handleDragOver}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={cn(
                        'flex h-full w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-800/50 transition-colors hover:bg-zinc-800',
                        isDragging && 'border-purple-500/50 bg-purple-500/5'
                      )}
                    >
                      <div className='rounded-full bg-zinc-900 p-3 shadow-sm'>
                        <ImagePlus className='h-5 w-5 sm:h-6 sm:w-6 text-zinc-400' />
                      </div>
                      <div className='text-center'>
                        <p className='text-sm font-medium text-white'>
                          Drag image or click to upload
                        </p>
                        <p className='text-xs text-zinc-400'>
                          A square 1:1 aspect ratio works best.
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type='file'
                        accept='image/*'
                        onChange={handleFileChange}
                        className='hidden'
                      />
                    </div>
                  ) : (
                    <div className='h-full'>
                      <div className='group relative h-full overflow-hidden rounded-lg border border-zinc-700'>
                        <Image
                          src={image}
                          alt='Preview'
                          fill
                          className='object-cover transition-transform duration-300 group-hover:scale-105'
                          sizes='(max-width: 640px) 100vw, 300px'
                        />
                        <div className='absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100' />
                        <div className='absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100'>
                          <Button
                            size='sm'
                            variant='destructive'
                            onClick={() => {
                              setImage(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                            className='h-9 w-9 p-0'
                          >
                            <ArrowLeft className='h-4 w-4' />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className='bg-zinc-900 p-6 mt-3 rounded-md -mb-6 h-[9vh] flex justify-between items-center'>
        <Button
          variant='secondary'
          onClick={handleGoBack}
          className='md:w-[200px]'
        >
          Back
        </Button>
        <Button
          onClick={createAgent}
          disabled={isCreatingAgent}
          className='md:w-[200px]'
        >
          {isCreatingAgent ? 'Creating...' : 'Create Agent'}
        </Button>
      </div>

      {isCreatingAgent && (
        <div className='fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center'>
          <div className='h-10 w-10 animate-spin rounded-full border-4 border-zinc-800 border-t-purple-500' />
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
