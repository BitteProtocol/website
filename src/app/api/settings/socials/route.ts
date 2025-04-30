import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
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
    return allConnections.filter((conn) => conn.userId === userId);
  } catch (error) {
    console.error('Failed to parse social connections:', error);
    return [];
  }
};

const saveSocialConnections = (connections: SocialConnection[]): void => {
  const cookieStore = cookies();

  // Get existing connections for other users
  const existingCookie = cookieStore.get(COOKIE_NAME);
  let allConnections: SocialConnection[] = [];

  if (existingCookie?.value) {
    try {
      allConnections = JSON.parse(existingCookie.value) as SocialConnection[];
      // Remove connections for the current user
      if (connections.length > 0) {
        const userId = connections[0].userId;
        allConnections = allConnections.filter(
          (conn) => conn.userId !== userId
        );
      }
    } catch (error) {
      console.error('Failed to parse existing connections:', error);
    }
  }

  // Add the new/updated connections
  allConnections = [...allConnections, ...connections];

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
  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }
  return session.user;
};

// Get user's connected accounts
export async function GET() {
  try {
    const user = await getUserFromSession();

    // Get existing social connections from storage
    const existingConnections = getUserSocialConnections(user.id);

    // Simply return the existing connections without automatically adding current provider
    return NextResponse.json(
      { accounts: existingConnections },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to get social connections' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// Connect a new social account
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromSession();
    const { provider, accountDetails } = await request.json();

    if (!provider || !accountDetails) {
      return NextResponse.json(
        { error: 'Provider and account details are required' },
        { status: 400 }
      );
    }

    // Get existing connections
    const existingConnections = getUserSocialConnections(user.id);

    // Check if this provider is already connected
    const existingIndex = existingConnections.findIndex(
      (conn) => conn.provider === provider
    );

    if (existingIndex >= 0) {
      // Update existing connection
      existingConnections[existingIndex] = {
        ...existingConnections[existingIndex],
        ...accountDetails,
      };
    } else {
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

    return NextResponse.json(
      {
        message: `${provider} account connected successfully`,
        data: { success: true },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to connect social account' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// Delete social connection
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider');

    if (!provider) {
      return NextResponse.json(
        { error: 'Provider is required' },
        { status: 400 }
      );
    }

    const user = await getUserFromSession();

    // Get existing connections
    const existingConnections = getUserSocialConnections(user.id);

    // Remove the specified provider
    const updatedConnections = existingConnections.filter(
      (conn) => conn.provider !== provider
    );

    // Save updated connections
    saveSocialConnections(updatedConnections);

    return NextResponse.json(
      { message: `${provider} account disconnected successfully` },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to disconnect social account' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
