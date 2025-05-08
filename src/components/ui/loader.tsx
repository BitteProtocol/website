import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const loaderVariants = cva(
  'inline-block rounded-full animate-spin border-2 border-solid border-current border-r-transparent',
  {
    variants: {
      size: {
        sm: 'h-4 w-4 border-2',
        md: 'h-6 w-6 border-2',
        lg: 'h-8 w-8 border-2',
        xl: 'h-12 w-12 border-3',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface LoaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loaderVariants> {}

export const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <div
        className={cn(loaderVariants({ size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Loader.displayName = 'Loader';
