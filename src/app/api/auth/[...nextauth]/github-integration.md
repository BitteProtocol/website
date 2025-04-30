# GitHub Integration Setup Instructions

## 1. NextAuth Configuration

Add the GitHub provider to your NextAuth configuration file. Edit `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import GithubProvider from 'next-auth/providers/github';

export const authOptions = {
  // Keep existing providers
  providers: [
    // Other providers like Twitter, etc.

    // Add GitHub provider
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          username: profile.login,
          provider: 'github',
        };
      },
    }),
  ],

  // Add proper callbacks for handling sessions and tokens to include GitHub profile
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      session.user.username = token.username;
      session.user.provider = token.provider;
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.provider = account.provider;
        token.username = user.username;
      }
      return token;
    },
  },
};
```

## 2. Environment Variables

Ensure these environment variables are set in your `.env.local` file:

```
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
```

## 3. Types for TypeScript

Update your NextAuth types in `src/types/next-auth.d.ts` to include GitHub fields:

```typescript
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      username?: string;
      provider?: string;
    };
  }

  interface User {
    username?: string;
    provider?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    username?: string;
    provider?: string;
  }
}
```

## 4. Testing

1. Run your application and navigate to the settings page
2. Click on the GitHub connect button
3. You should be redirected to GitHub's authorization page
4. After authorizing, you should be redirected back to your settings page with GitHub connected
5. Test disconnecting GitHub by clicking the disconnect button

## 5. Database Integration

When ready to move from mock data to a real database, update the `saveUserSocialAccount` function in `src/app/api/settings/socials/route.ts`.

Example with Prisma:

```typescript
const saveUserSocialAccount = async (
  userId: string,
  provider: string,
  accountDetails: any
) => {
  return prisma.socialConnection.upsert({
    where: {
      userId_provider: { userId, provider },
    },
    update: {
      username: accountDetails.username,
      profileUrl: accountDetails.profileUrl,
    },
    create: {
      userId,
      provider,
      username: accountDetails.username,
      profileUrl: accountDetails.profileUrl,
    },
  });
};
```
