import NextAuth from 'next-auth/next';
import { authOptions } from './auth-options';

// Create NextAuth handler
const handler = NextAuth(authOptions);

// Export handler for API routes
export { handler as GET, handler as POST };
