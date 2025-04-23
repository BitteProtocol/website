# Social Authentication Implementation

This document outlines the implementation of social authentication via GitHub and Twitter for the settings page.

## Files Created/Modified

1. `src/app/api/auth/[...nextauth]/route.ts` - NextAuth API route with GitHub and Twitter OAuth providers
2. `src/app/api/settings/socials/route.ts` - API route for managing social connections
3. `src/hooks/useNextAuthSocialConnections.ts` - Custom hook to interface with NextAuth and the socials API
4. `src/components/settings/SocialSection.tsx` - Component for displaying and managing social connections
5. `src/providers/NextAuthProvider.tsx` - NextAuth session provider
6. `.env.local.example` - Example environment variables needed for configuration

## Required Dependencies

- `next-auth` - For handling authentication with social providers
- TypeScript types for next-auth

## Setup Required

1. Install the necessary dependencies:

   ```bash
   npm install next-auth
   npm install -D @types/next-auth
   ```

2. Create OAuth Applications:

   - For GitHub: [GitHub Developer Settings](https://github.com/settings/developers)
   - For Twitter: [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)

3. Set up environment variables by copying `.env.local.example` to `.env.local` and filling in the values.

4. For GitHub OAuth:
   - Set callback URL to `https://yourdomain.com/api/auth/callback/github`
   - Request user email scope
5. For Twitter OAuth:
   - Set callback URL to `https://yourdomain.com/api/auth/callback/twitter`
   - Use OAuth 2.0
   - Request user read permissions

## Database Setup (To Be Implemented)

For full functionality, you'll need to implement a database schema for storing social connections. Example schema using Prisma:

```prisma
model User {
  id                String             @id @default(cuid())
  // other user fields
  socialConnections SocialConnection[]
}

model SocialConnection {
  id          String   @id @default(cuid())
  userId      String
  provider    String   // "github" or "twitter"
  providerId  String   // ID from the provider
  username    String
  profileUrl  String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, provider])
}
```

## Testing

To test the implementation:

1. Set up the OAuth applications and environment variables
2. Navigate to the settings page
3. Click on the GitHub or Twitter connect buttons
4. You will be redirected to the OAuth consent screen
5. After authorizing, you should be redirected back to the settings page with the connection shown

## Security Considerations

- Use a strong, randomly generated `NEXTAUTH_SECRET`
- Store OAuth client secrets securely in environment variables
- Implement proper authorization checks in the API routes
- Consider using CSRF protection
- Only request the minimum scopes needed for authentication
