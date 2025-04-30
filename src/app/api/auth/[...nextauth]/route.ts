import NextAuth, { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import TwitterProvider from 'next-auth/providers/twitter';

// Add TwitterProfile interface to handle both v1 and v2 response formats
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

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
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
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: '2.0',
      profile(profile: TwitterProfile) {
        // Handle both Twitter API v1 and v2 response formats
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
            id: profile.id!,
            name: profile.name!,
            username: profile.screen_name!,
            image: profile.profile_image_url_https!,
            provider: 'twitter',
          };
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        // Add provider-specific user data to session
        session.user.id = token.sub!;
        session.user.provider = token.provider as string;
        session.user.username = token.username as string;
      }
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      // Pass provider-specific data to the token
      if (user) {
        token.provider = account?.provider || '';
        // The username might be in different locations depending on the provider
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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
