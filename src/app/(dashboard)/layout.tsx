'use client';

import { AppSidebar } from '@/components/app-sidebar';
import PageLoaderSkeleton from '@/components/layout/PageLoaderSkeleton';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, Suspense, useEffect, useState, useTransition } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending] = useTransition();
  const [isScrolled, setIsScrolled] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([router.prefetch('/agents'), router.prefetch('/chat')]).catch(
      (error) => console.error('Error prefetching routes:', error)
    );
  }, [router]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setBreadcrumbs(pathname.split('/').filter(Boolean));
  }, [pathname]);

  const formatBreadcrumb = (crumb: string) =>
    crumb
      .replace(/[-.]/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header
          className={cn(
            'flex h-16 shrink-0 items-center gap-2 px-4 sticky top-0 z-[50]',
            isScrolled && 'bg-sidebar',
            isPending && 'opacity-70'
          )}
        >
          <SidebarTrigger className='-ml-1' />
          <Separator orientation='vertical' className='mr-2 h-4' />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs?.length === 0
                ? Array.from({ length: 2 }).map((_, index) => (
                    <Skeleton key={index} className='w-20 h-4 rounded' />
                  ))
                : breadcrumbs.map((crumb, index) => {
                    const path = `/${breadcrumbs.slice(0, index + 1).join('/')}`;
                    return (
                      <BreadcrumbItem key={index}>
                        <Link
                          href={path}
                          prefetch={true}
                          className={cn(
                            'uppercase text-xs font-semibold',
                            path === pathname
                              ? 'text-[#FAFAFA]'
                              : 'text-[#7C7C7C]',
                            isPending ? 'cursor-wait' : 'cursor-pointer'
                          )}
                        >
                          {formatBreadcrumb(crumb)}
                        </Link>
                        {index < breadcrumbs.length - 1 && (
                          <BreadcrumbSeparator />
                        )}
                      </BreadcrumbItem>
                    );
                  })}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <Suspense fallback={<PageLoaderSkeleton className='mx-4 mt-4' />}>
          <main className='flex flex-1 flex-col gap-4 p-4'>{children}</main>
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}
