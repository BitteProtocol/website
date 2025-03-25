import { ReactNode } from 'react';
import Providers from '@/lib/providers/Providers';
import { headers } from 'next/headers';
import RootSidebar from '@/components/root-sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const headersList = await headers();
  const cookies = headersList.get('wagmi');

  return (
    <Providers cookies={cookies}>
      <RootSidebar>{children}</RootSidebar>
    </Providers>
  );
}
