// Utility function to determine if the header should be shown
export function shouldShowHeader(pathname: string): boolean {
  const noHeaderRoutes = ['/chat', '/agents'];
  return !noHeaderRoutes.some((route) => pathname.startsWith(route));
}

export function shouldShowFooter(pathname: string): boolean {
  const noFooterRoutes = ['/chat', '/agents'];
  return !noFooterRoutes.some((route) => pathname.startsWith(route));
}
