// Utility function to determine if the header should be shown
export function shouldShowHeader(pathname: string): boolean {
  const noHeaderRoutes = ['/dashboard']; // Add routes where you don't want the header
  return !noHeaderRoutes.includes(pathname);
}
