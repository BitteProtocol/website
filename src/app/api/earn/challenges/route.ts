import { NextResponse } from 'next/server';
/* import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'; */

interface Challenge {
  id: string;
  title: string;
  reward: number;
  frequency: 'ONE TIME' | 'DAILY' | 'WEEKLY';
  completed: boolean;
  ctaText: string;
  ctaLink: string;
}

// Mock data for challenges - will be replaced with database calls
const MOCK_CHALLENGES: Challenge[] = [
  {
    id: '1',
    title: 'Secure your account with E-Mail, X and GitHub.',
    reward: 20,
    frequency: 'ONE TIME',
    completed: false,
    ctaText: 'Settings',
    ctaLink: '/settings',
  },
  {
    id: '2',
    title: 'Build transactions using agents',
    reward: 10,
    frequency: 'DAILY',
    completed: false,
    ctaText: 'Chat',
    ctaLink: '/chat',
  },
  {
    id: '3',
    title: 'Build an agent',
    reward: 10,
    frequency: 'ONE TIME',
    completed: false,
    ctaText: 'Agent Builder',
    ctaLink: '/build-agents',
  },
  {
    id: '4',
    title: 'Get an agent verified',
    reward: 10,
    frequency: 'ONE TIME',
    completed: false,
    ctaText: 'Submit Agent',
    ctaLink: '/my-agents',
  },
];

// GET /api/earn/challenges - Get all challenges (public endpoint)
export async function GET() {
  /*   try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // In a real implementation, we would fetch the challenges from the database
    // and check which ones the user has completed
    // For now, just return the mock data

    return NextResponse.json(
      {
        challenges: MOCK_CHALLENGES,
        stats: {
          nextPayoutDate: 'Tuesday, April 22nd',
          totalReward: 480,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch challenges' },
      { status: 500 }
    );
  } */
  // No authentication required - this is a public endpoint
  return NextResponse.json(
    {
      challenges: MOCK_CHALLENGES,
      stats: {
        nextPayoutDate: 'Tuesday, April 22nd',
        totalReward: 480,
      },
    },
    { status: 200 }
  );
}

// POST /api/earn/challenges - Mark a challenge as complete (placeholder for future implementation)
export async function POST(request: Request) {
  try {
    /*     const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
 */
    const data = await request.json();
    const { challengeId } = data;

    if (!challengeId) {
      return NextResponse.json(
        { error: 'Challenge ID is required' },
        { status: 400 }
      );
    }

    // In a real implementation, we would mark the challenge as completed in the database
    // For now, just return a success response
    return NextResponse.json(
      { message: 'Challenge completed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error completing challenge:', error);
    return NextResponse.json(
      { error: 'Failed to complete challenge' },
      { status: 500 }
    );
  }
}
