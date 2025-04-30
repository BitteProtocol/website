import NextAuth from 'next-auth/next';
import GithubProvider from 'next-auth/providers/github';
import TwitterProvider from 'next-auth/providers/twitter';
/* import type { JWT } from 'next-auth/jwt'; */

/**
 * Define custom session and user types
 */
/* type SessionCallback = {
  session: {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id?: string;
      provider?: string;
      username?: string;
    };
  };
  token: JWT & {
    sub?: string;
    provider?: string;
    username?: string;
  };
};

type JWTCallback = {
  token: JWT & {
    provider?: string;
    username?: string;
  };
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username?: string;
  };
  account?: {
    provider?: string;
    type?: string;
    id?: string;
  } | null;
}; */

/**
 * Twitter profile data interface
 */
interface TwitterProfile {
  data?: {
    id: string;
    name: string;
    username: string;
    profile_image_url: string;
  };
  id?: string;
  name?: string;
  screen_name?: string;
  profile_image_url_https?: string;
}

// Define NextAuth configuration
export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          username: profile.login,
          email: profile.email,
          image: profile.avatar_url,
          provider: 'github',
        };
      },
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID || '',
      clientSecret: process.env.TWITTER_CLIENT_SECRET || '',
      version: '2.0',
      profile(profile: TwitterProfile) {
        if (profile.data) {
          // Twitter API v2 format
          return {
            id: profile.data.id,
            name: profile.data.name,
            username: profile.data.username,
            image: profile.data.profile_image_url,
            provider: 'twitter',
          };
        } else {
          // Twitter API v1 format (fallback)
          return {
            id: profile.id || '',
            name: profile.name || '',
            username: profile.screen_name || '',
            image: profile.profile_image_url_https || '',
            provider: 'twitter',
          };
        }
      },
    }),
  ],
  callbacks: {
    // @ts-ignore - NextAuth types are difficult to get right
    async session({ session, token }) {
      if (session?.user) {
        // Add provider-specific data to session
        session.user.id = token.sub;
        session.user.provider = token.provider;
        session.user.username = token.username;
      }
      return session;
    },
    // @ts-ignore - NextAuth types are difficult to get right
    async jwt({ token, user, account }) {
      // Pass provider-specific data to the token
      if (user) {
        token.provider = account?.provider || '';
        token.username = user.username || '';
      }
      return token;
    },
  },
  pages: {
    signIn: '/settings',
    signOut: '/settings',
  },
};

// Create NextAuth handler
const handler = NextAuth(authOptions);

// Export handler for API routes
export { handler as GET, handler as POST };
