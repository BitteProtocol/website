import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Get user from session
const getUserFromSession = async () => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }
  return session.user;
};

// Save connection to database (this would connect to your DB)
const saveUserSocialAccount = async (
  userId: string,
  provider: string,
  accountDetails: any
) => {
  // Here you'd store in your database, example with Prisma:
  // return prisma.socialConnection.upsert({
  //   where: {
  //     userId_provider: { userId, provider }
  //   },
  //   update: {
  //     username: accountDetails.username,
  //     profileUrl: accountDetails.profileUrl
  //   },
  //   create: {
  //     userId,
  //     provider,
  //     username: accountDetails.username,
  //     profileUrl: accountDetails.profileUrl
  //   }
  // });

  // For now, just simulate success
  console.log(
    `Saving ${provider} connection for user ${userId}:`,
    accountDetails
  );
  return { success: true };
};

// Get user's connected accounts
export async function GET() {
  try {
    const user = await getUserFromSession();

    // Here you'd fetch from your database, example with Prisma:
    // const connections = await prisma.socialConnection.findMany({
    //   where: { userId: user.id }
    // });

    // For now, return mock data based on session
    const connections = [];

    // If the user is authenticated via GitHub, add GitHub connection
    if (user.provider === 'github') {
      connections.push({
        provider: 'github',
        username: user.username || '@github-user',
        profileUrl: `https://github.com/${user.username}`,
      });
    }

    // If the user is authenticated via Twitter, add Twitter connection
    if (user.provider === 'twitter') {
      connections.push({
        provider: 'twitter',
        username: user.username || '@twitter-user',
        profileUrl: `https://twitter.com/${user.username}`,
      });
    }

    return NextResponse.json({ accounts: connections }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to get social connections' },
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

    // Here you'd delete from your database, example with Prisma:
    // await prisma.socialConnection.delete({
    //   where: {
    //     userId_provider: { userId: user.id, provider }
    //   }
    // });

    // Just log for now
    console.log(`Deleting ${provider} connection for user ${user.id}`);

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
