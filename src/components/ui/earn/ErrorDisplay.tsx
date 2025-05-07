import React from 'react';
import { RefreshCw } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

export function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <div className='bg-red-500/10 border border-red-500/50 rounded-md p-4 mb-4'>
      <div className='flex items-start gap-4'>
        <div className='text-red-500'>⚠️</div>
        <div className='flex-1'>
          <p className='text-red-500'>{message}</p>
        </div>
        <button
          onClick={onRetry}
          className='flex items-center gap-2 text-sm text-zinc-400 hover:text-white'
        >
          <RefreshCw size={14} />
          Retry
        </button>
      </div>
    </div>
  );
}
