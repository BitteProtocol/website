import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import TwitterProvider from 'next-auth/providers/twitter';

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
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
      profile(profile) {
        return {
          id: profile.data.id,
          name: profile.data.name,
          username: profile.data.username,
          image: profile.data.profile_image_url,
          provider: 'twitter',
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        // Add provider-specific user data to session
        session.user.id = token.sub;
        session.user.provider = token.provider;
        session.user.username = token.username;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      // Pass provider-specific data to the token
      if (user) {
        token.provider = account?.provider;
        token.username = user.username;
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
