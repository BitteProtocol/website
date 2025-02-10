'use client';

import { ReactNode, useState, useEffect } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { usePathname } from 'next/navigation';

interface MainLayoutProps {
  children: ReactNode;
}

export default function SidebarLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);

  useEffect(() => {
    // Update breadcrumbs based on the current pathname
    const pathParts = pathname.split('/').filter(Boolean);
    setBreadcrumbs(pathParts);
  }, [pathname]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
          <SidebarTrigger className='-ml-1' />
          <Separator orientation='vertical' className='mr-2 h-4' />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <BreadcrumbItem key={index}>
                  <BreadcrumbLink
                    href={`/${breadcrumbs.slice(0, index + 1).join('/')}`}
                  >
                    {crumb}
                  </BreadcrumbLink>
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className='flex flex-1 flex-col gap-4 p-4'>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
