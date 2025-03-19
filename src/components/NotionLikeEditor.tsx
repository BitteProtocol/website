import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';

interface NotionLikeEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  onFocus?: () => void;
}

export function NotionLikeEditor({
  content,
  onChange,
  placeholder = 'Type # for heading, - for bullet points...',
  onFocus,
}: NotionLikeEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-invert min-h-full w-full focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onFocus: () => {
      onFocus?.();
    },
  });

  // Update editor content when content prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className='min-h-full text-white bg-transparent'>
      <style jsx global>{`
        .ProseMirror {
          min-height: 100%;
          padding: 1rem;
          font-size: 12px;
          line-height: 1.4;
          color: #fff;
          background: transparent !important;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          color: #666;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }

        .ProseMirror h1 {
          font-size: 1.5rem;
          line-height: 2rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          color: #fff;
        }

        .ProseMirror h2 {
          font-size: 1.1rem;
          line-height: 1.5rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.4rem;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .ProseMirror h3 {
          font-size: 0.95rem;
          line-height: 1.3rem;
          font-weight: 600;
          margin-top: 0.8rem;
          margin-bottom: 0.4rem;
          color: #e4e4e7;
        }

        .ProseMirror p {
          margin-bottom: 0.4rem;
          color: #d4d4d8;
          font-size: 0.8rem;
        }

        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1rem;
          margin-bottom: 0.6rem;
          color: #d4d4d8;
        }

        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1rem;
          margin-bottom: 0.6rem;
          color: #d4d4d8;
        }

        .ProseMirror li {
          margin-bottom: 0.2rem;
          font-size: 0.8rem;
        }

        .ProseMirror blockquote {
          border-left: 2px solid #3f3f46;
          padding-left: 0.6rem;
          margin-left: 0;
          margin-right: 0;
          font-style: italic;
          color: #a1a1aa;
          font-size: 0.8rem;
        }

        .ProseMirror code {
          background-color: rgba(63, 63, 70, 0.5);
          padding: 0.1rem 0.2rem;
          border-radius: 0.25rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
            monospace;
          font-size: 0.7rem;
          color: #e4e4e7;
        }

        .ProseMirror pre {
          background-color: rgba(24, 24, 27, 0.6);
          padding: 0.6rem;
          border-radius: 0.4rem;
          overflow-x: auto;
          margin: 0.6rem 0;
        }

        .ProseMirror pre code {
          background: none;
          padding: 0;
          border-radius: 0;
          color: #e4e4e7;
          font-size: 0.7rem;
        }

        .ProseMirror hr {
          border: none;
          border-top: 1px solid #3f3f46;
          margin: 1.2rem 0;
        }

        .ProseMirror em {
          color: #a1a1aa;
        }

        .ProseMirror strong {
          color: #fff;
          font-weight: 600;
        }
      `}</style>
      <EditorContent editor={editor} className='bg-background' />
    </div>
  );
}
