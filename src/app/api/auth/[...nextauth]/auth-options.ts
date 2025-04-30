import GithubProvider from 'next-auth/providers/github';
import TwitterProvider from 'next-auth/providers/twitter';

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
    async session(params: { session: any; token: any }) {
      const { session, token } = params;
      if (session?.user) {
        // Add provider-specific data to session
        session.user.id = token.sub || '';
        session.user.provider = token.provider || '';
        session.user.username = token.username || '';
      }
      return session;
    },
    async jwt(params: {
      token: any;
      user?: any;
      account?: any;
      trigger?: any;
    }) {
      const { token, user, account, trigger } = params;
      // On sign in or when user data changes
      if (trigger === 'signIn' || trigger === 'update' || user) {
        if (user) {
          // Keep the original user ID provided by the provider
          token.sub = user.id;

          // Add provider-specific information from the account object
          if (account) {
            token.provider = account.provider;
          }

          // Add username from the custom user object we created in the profile callbacks
          if ('username' in user) {
            token.username = user.username;
          }

          console.log('JWT callback:', {
            trigger,
            user: { id: user.id, email: user.email },
            provider: account?.provider,
            token: { sub: token.sub },
          });
        }
      }

      return token;
    },
    async signIn(params: { user: any; account?: any; profile?: any }) {
      const { user } = params;
      // Validate essential data
      if (!user || !user.id) {
        console.error('Sign in failed - missing user data:', { user });
        return false;
      }

      return true;
    },
  },
  pages: {
    signIn: '/settings',
    signOut: '/settings',
  },
};
