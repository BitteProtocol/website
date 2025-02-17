'use client';

import { AppSidebar } from '@/components/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';

interface MainLayoutProps {
  children: ReactNode;
}

export default function SidebarLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Update breadcrumbs based on the current pathname
    const pathParts = pathname.split('/').filter(Boolean);
    setBreadcrumbs(pathParts);
  }, [pathname]);

  function formatBreadcrumb(crumb: string) {
    const substringsToRemove = [
      '.vercel.app',
      '.azurewebsites.net',
      '.interar.tech',
      'hqd5dzcjajhpc3fa.eastus-01',
    ];

    // Remove unwanted substrings
    substringsToRemove.forEach((substring) => {
      crumb = crumb.replace(substring, '');
    });

    // Replace hyphens and dots with spaces and capitalize each word
    return crumb
      .replace(/[-.]/g, ' ')
      .split(' ')
      .filter((word) => word) // Remove empty strings
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header
          className={`flex h-16 shrink-0 items-center gap-2 px-4 sticky top-0 z-[50] ${isScrolled ? 'bg-sidebar' : ''}`}
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
                    const isActive =
                      `/${breadcrumbs.slice(0, index + 1).join('/')}` ===
                      pathname;
                    return (
                      <BreadcrumbItem key={index}>
                        <BreadcrumbLink
                          href={`/${breadcrumbs.slice(0, index + 1).join('/')}`}
                          className={`uppercase text-xs font-semibold ${isActive ? 'text-[#FAFAFA]' : 'text-[#7C7C7C]'}`}
                        >
                          {formatBreadcrumb(crumb)}
                        </BreadcrumbLink>
                        {index < breadcrumbs.length - 1 && (
                          <BreadcrumbSeparator />
                        )}
                      </BreadcrumbItem>
                    );
                  })}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className='flex flex-1 flex-col gap-4 p-4'>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
