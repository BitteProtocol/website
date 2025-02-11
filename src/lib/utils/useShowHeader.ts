// Utility function to determine if the header should be shown
export function shouldShowHeader(pathname: string): boolean {
  const noHeaderRoutes = ['/chat', '/agents'];
  return !noHeaderRoutes.includes(pathname);
}
