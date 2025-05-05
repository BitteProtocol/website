// Utility function to determine if the header should be shown
export function shouldShowHeader(pathname: string): boolean {
  const noHeaderRoutes = [
    '/chat',
    '/agents',
    '/build-agents',
    '/my-agents',
    '/settings',
    '/earn',
  ];
  return !noHeaderRoutes.some((route) => pathname.startsWith(route));
}

export function shouldShowFooter(pathname: string): boolean {
  const noFooterRoutes = [
    '/chat',
    '/agents',
    '/build-agents',
    '/my-agents',
    '/settings',
    '/earn',
  ];
  return !noFooterRoutes.some((route) => pathname.startsWith(route));
}
