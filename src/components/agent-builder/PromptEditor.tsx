import { useState, useEffect, useMemo, useRef } from 'react';
import { Tool } from '@/lib/types/tool.types';
import { NotionLikeEditor } from '@/components/NotionLikeEditor';
import { Skeleton } from '@/components/ui/skeleton';

interface PromptEditorProps {
  instructions: string;
  setInstructions: (instructions: string) => void;
  selectedTools: Tool[];
}

export function PromptEditor({
  instructions,
  setInstructions,
  selectedTools,
}: PromptEditorProps) {
  const [editorLoading, setEditorLoading] = useState<boolean>(true);
  const previousToolsRef = useRef<Tool[]>([]);

  // Simulate editor loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setEditorLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Generate tools section content
  const generateToolsList = (tools: Tool[]) => {
    return tools.length > 0
      ? tools
          .map(
            (tool) => `
<h3>${tool.function.name}</h3>
<p>[When and how to use this tool]</p>`
          )
          .join('\n')
      : `
<h3>No tools selected</h3>
<p>Return to the previous step to select tools.</p>`;
  };

  // Default content for the editor
  const defaultInstructions = useMemo(() => {
    const toolsList = generateToolsList(selectedTools);

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

  // Update instructions when tools change
  useEffect(() => {
    // Initialize with default if empty
    if (!instructions) {
      setInstructions(defaultInstructions);
      previousToolsRef.current = [...selectedTools];
      return;
    }

    // Check if tools have changed
    const toolsChanged =
      selectedTools.length !== previousToolsRef.current.length ||
      selectedTools.some(
        (tool, index) =>
          index >= previousToolsRef.current.length ||
          tool.function.name !== previousToolsRef.current[index]?.function.name
      );

    // Update only if tools have changed
    if (toolsChanged) {
      // Try to update only the tools section
      const toolsSectionRegex = /<h2>🛠️ Tools<\/h2>\s+([\s\S]*?)(?=<h2>|$)/;
      const match = instructions.match(toolsSectionRegex);

      if (match) {
        // Replace just the tools section
        const updatedInstructions = instructions.replace(
          toolsSectionRegex,
          `<h2>🛠️ Tools</h2>\n${generateToolsList(selectedTools)}\n\n`
        );
        setInstructions(updatedInstructions);
      }
    }

    // Update reference for next comparison
    previousToolsRef.current = [...selectedTools];
  }, [selectedTools, instructions, setInstructions, defaultInstructions]);

  return (
    <div className='h-full flex flex-col'>
      <h2 className='text-sm font-medium mb-2'>Prompt</h2>
      <div className='border border-mb-gray-600 rounded-md overflow-hidden bg-transparent flex-1 h-[calc(100%-3rem)]'>
        {editorLoading ? (
          <div className='p-4 bg-zinc-900/20 h-full space-y-4'>
            <Skeleton className='h-7 w-1/2' />
            <Skeleton className='h-6 w-3/4' />
            <Skeleton className='h-5 w-full' />
            <Skeleton className='h-5 w-2/3' />
            <Skeleton className='h-5 w-5/6' />
            <Skeleton className='h-6 w-1/2' />
            <Skeleton className='h-5 w-3/4' />
            <Skeleton className='h-5 w-full' />
            <Skeleton className='h-5 w-3/5' />
          </div>
        ) : (
          <div className='h-full'>
            <NotionLikeEditor
              content={instructions}
              onChange={setInstructions}
              placeholder='Describe how your agent should behave...'
            />
          </div>
        )}
      </div>
      <div className='h-12 flex items-center'>
        <small className='text-sm text-mb-gray-500'>Markdown accepted.</small>
      </div>
    </div>
  );
}
