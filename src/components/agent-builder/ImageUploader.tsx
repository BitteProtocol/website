import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, ArrowLeft, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  image: string | null;
  setImage: (image: string | null) => void;
}

export function ImageUploader({ image, setImage }: ImageUploaderProps) {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [imagePrompt, setImagePrompt] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      // Update the image state
      setImage(data.url);

      toast({
        title: 'Success',
        description: 'Image generated successfully and added to your agent',
        variant: 'default',
      });
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

  return (
    <div className='space-y-8'>
      {/* Generate Image */}
      <div className='space-y-3'>
        <div className='space-y-2'>
          <label className='text-sm font-medium text-mb-white-100'>
            Generate Image
          </label>
        </div>

        <div className='flex items-center gap-3'>
          <Input
            className='border-zinc-800 text-white focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-zinc-700 min-w-[250px] text-base'
            placeholder='Details of your image'
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
          />
          <Button
            variant='secondary'
            onClick={handleGenerateImage}
            disabled={isGeneratingImage}
            className='w-full sm:w-auto whitespace-nowrap min-w-[100px] bg-secondary text-secondary-foreground hover:text-secondary-foreground hover:bg-secondary/80'
          >
            {isGeneratingImage ? (
              <div className='flex items-center gap-2'>
                <Loader2 className='h-4 w-4 animate-spin' />
                <span>Generating</span>
              </div>
            ) : (
              'Generate'
            )}
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
                'flex h-full w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-mb-blue-100 bg-zinc-900/20 transition-colors hover:bg-zinc-900/40',
                isDragging && 'border-mb-blue-100 bg-mb-blue-100/10',
                'upload-box'
              )}
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%2360A5FA' stroke-width='2' stroke-dasharray='8, 8' stroke-dashoffset='0' stroke-linecap='round'/%3e%3c/svg%3e\")",
                borderRadius: '8px',
                border: 'none',
              }}
            >
              <div className='rounded-full border border-mb-blue-100 p-3 shadow-sm'>
                <Plus className='h-4 w-4 text-mb-blue-100' />
              </div>
              <div className='text-center'>
                <p className='text-sm font-medium text-mb-blue-100'>
                  Drag image or click to upload
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
        <div className='h-12 flex items-center'>
          <small className='text-sm text-mb-gray-350'>
            A square 1:1 aspect ratio works best.
          </small>
        </div>
      </div>
    </div>
  );
}
