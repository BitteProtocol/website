import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

const PageLoaderSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn('flex gap-3', className)}>
      <Skeleton className='w-full md:w-1/3 h-[70vh]' />
      <Skeleton className='w-2/3 h-[70vh] hidden md:block' />
    </div>
  );
};

export default PageLoaderSkeleton;
