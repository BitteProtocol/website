import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { cookies } from 'next/headers';

// Interface for social account connections
export interface SocialConnection {
  provider: string;
  username: string;
  profileUrl?: string;
  userId: string;
}

// Helper to get/set social connections from cookies
const COOKIE_NAME = 'user_social_connections';
const MASTER_USER_ID_COOKIE = 'master_user_id'; // Cookie to maintain consistent user ID

// Helper to get a consistent ID for users regardless of provider
const getMasterUserId = (userId: string, email?: string | null): string => {
  const cookieStore = cookies();
  // First, check if we already have a master ID stored in cookies
  const masterIdCookie = cookieStore.get(MASTER_USER_ID_COOKIE);

  if (masterIdCookie?.value) {
    return masterIdCookie.value;
  }

  // If no master ID yet, use email if available as it's consistent across providers
  // Otherwise use the provided userId
  const masterId = email ? `email:${email}` : `user:${userId}`;

  // Store this for future authentications
  cookieStore.set(MASTER_USER_ID_COOKIE, masterId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });

  return masterId;
};

const getUserSocialConnections = (userId: string): SocialConnection[] => {
  const cookieStore = cookies();
  const connectionsCookie = cookieStore.get(COOKIE_NAME);

  if (!connectionsCookie?.value) {
    return [];
  }

  try {
    const allConnections = JSON.parse(
      connectionsCookie.value
    ) as SocialConnection[];
    // Return all connections with matching userId
    return allConnections.filter((conn) => conn.userId === userId);
  } catch (error) {
    console.error('Failed to parse social connections:', error);
    return [];
  }
};

const saveSocialConnections = (connections: SocialConnection[]): void => {
  if (!connections.length) return;

  const cookieStore = cookies();
  const userId = connections[0].userId; // All connections should have the same userId

  // Get all existing connections
  const existingCookie = cookieStore.get(COOKIE_NAME);
  let allConnections: SocialConnection[] = [];

  if (existingCookie?.value) {
    try {
      allConnections = JSON.parse(existingCookie.value) as SocialConnection[];

      // Remove all existing connections for this user
      allConnections = allConnections.filter((conn) => conn.userId !== userId);
    } catch (error) {
      console.error('Failed to parse existing connections:', error);
    }
  }

  // Add all the new/updated connections
  allConnections = [...allConnections, ...connections];

  // For debugging
  console.log('Saving connections:', {
    userId,
    newConnections: connections,
    allConnections: allConnections,
  });

  // Save back to cookie
  cookieStore.set(COOKIE_NAME, JSON.stringify(allConnections), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
};

// Get user from session
const getUserFromSession = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  // Get email from session for consistent identification
  const email = session.user.email;

  // Get user ID from session
  const userId = session.user.id;
  if (!userId) {
    console.error('Session user is missing ID');
    throw new Error('Invalid user session - missing ID');
  }

  // Use a consistent master ID instead of the provider's user ID
  const masterUserId = getMasterUserId(userId, email);

  console.log('Session user resolved to:', {
    providerId: userId,
    email,
    masterUserId,
    provider: session.user.provider,
    username: session.user.username,
  });

  // Return user with the consistent master ID
  return {
    ...session.user,
    id: masterUserId,
  };
};

// Get user's connected accounts
export async function GET() {
  try {
    const user = await getUserFromSession();

    // Get existing social connections from storage
    const existingConnections = getUserSocialConnections(user.id);
    console.log('Existing connections:', existingConnections);

    // Check if we should automatically add the current provider
    if (user.provider && user.username) {
      // See if this provider is already in the connections
      const providerExists = existingConnections.some(
        (conn) => conn.provider === user.provider
      );

      // If not, add it
      if (!providerExists) {
        const profileUrl =
          user.provider === 'github'
            ? `https://github.com/${user.username}`
            : user.provider === 'twitter'
              ? `https://twitter.com/${user.username}`
              : undefined;

        // Create new connection object
        const newConnection: SocialConnection = {
          provider: user.provider,
          username: user.username,
          profileUrl,
          userId: user.id,
        };

        // Add to existing connections and save
        existingConnections.push(newConnection);
        saveSocialConnections(existingConnections);
        console.log('Updated connections:', existingConnections);
      }
    }

    // Return all connections
    return NextResponse.json(
      { accounts: existingConnections },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Error getting social connections:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to get social connections' },
      { status: errorMessage === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// Connect a new social account
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromSession();
    const { provider, accountDetails } = await request.json();

    console.log('POST received:', {
      provider,
      accountDetails,
      userId: user.id,
    });

    if (!provider || !accountDetails) {
      return NextResponse.json(
        { error: 'Provider and account details are required' },
        { status: 400 }
      );
    }

    // Get existing connections
    const existingConnections = getUserSocialConnections(user.id);
    console.log('Existing connections before update:', existingConnections);

    // Check if this provider is already connected
    const existingIndex = existingConnections.findIndex(
      (conn) => conn.provider === provider
    );

    if (existingIndex >= 0) {
      console.log('Updating existing connection for provider:', provider);
      // Update existing connection
      existingConnections[existingIndex] = {
        ...existingConnections[existingIndex],
        ...accountDetails,
        userId: user.id, // Ensure userId is correctly set
      };
    } else {
      console.log('Adding new connection for provider:', provider);
      // Add new connection
      existingConnections.push({
        provider,
        username: accountDetails.username,
        profileUrl: accountDetails.profileUrl,
        userId: user.id,
      });
    }

    // Save connections
    saveSocialConnections(existingConnections);
    console.log('Updated connections after save:', existingConnections);

    return NextResponse.json(
      {
        message: `${provider} account connected successfully`,
        data: { success: true },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in social connection:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to connect social account' },
      { status: errorMessage === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// Delete social connection
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider');

    console.log('DELETE request for provider:', provider);

    if (!provider) {
      return NextResponse.json(
        { error: 'Provider is required' },
        { status: 400 }
      );
    }

    const user = await getUserFromSession();
    console.log('User requesting deletion:', user.id);

    // Get existing connections
    const existingConnections = getUserSocialConnections(user.id);
    console.log('Current connections before delete:', existingConnections);

    // Remove the specified provider
    const updatedConnections = existingConnections.filter(
      (conn) => conn.provider !== provider
    );
    console.log('Connections after filter:', updatedConnections);

    // Save updated connections
    saveSocialConnections(updatedConnections);
    console.log('Connections saved after deletion');

    return NextResponse.json(
      { message: `${provider} account disconnected successfully` },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in social disconnection:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to disconnect social account' },
      { status: errorMessage === 'Unauthorized' ? 401 : 500 }
    );
  }
}
