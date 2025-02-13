import { cn } from '@/lib/utils';
import { FC, ReactNode } from 'react';
import { Button } from '../button';

interface AgentsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export const AgentsDrawer: FC<AgentsDrawerProps> = ({
  open,
  onOpenChange,
  children,
}) => {
  return (
    <div
      className={cn('fixed inset-0 z-50 lg:hidden', open ? 'block' : 'hidden')}
    >
      <div
        className={cn('fixed inset-0 bg-black/80')}
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border border-border bg-background'
        )}
      >
        <div className='mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted' />
        <div className='px-4'>{children}</div>
        <div className='mt-auto flex flex-col gap-2 p-4'>
          <Button
            variant='outline'
            className='w-full text-center'
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
