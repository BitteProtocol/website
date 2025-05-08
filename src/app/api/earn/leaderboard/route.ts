import { NextResponse } from 'next/server';
/* import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'; */

interface LeaderboardUser {
  id: number;
  username: string;
  payout: number;
  agent: string;
  pings: number;
  hasGithub: boolean;
  hasTwitter: boolean;
}

// Mock data for leaderboard - will be replaced with database calls
const MOCK_LEADERBOARD: LeaderboardUser[] = [
  {
    id: 1,
    username: 'marcelokunze.near',
    payout: 100,
    agent: 'Visual Swapper',
    pings: 10533,
    hasGithub: true,
    hasTwitter: true,
  },
  {
    id: 2,
    username: '0xd8d...6045',
    payout: 90,
    agent: 'Crypto Explorer',
    pings: 25000,
    hasGithub: true,
    hasTwitter: true,
  },
  {
    id: 3,
    username: '0xd8d...6045',
    payout: 80,
    agent: 'Block Miner',
    pings: 45678,
    hasGithub: true,
    hasTwitter: true,
  },
  {
    id: 4,
    username: 'vitalik.eth',
    payout: 70,
    agent: 'Smart Contract Creator',
    pings: 33333,
    hasGithub: true,
    hasTwitter: true,
  },
  {
    id: 5,
    username: '0xd8d...6045',
    payout: 60,
    agent: 'Decentralized Artist',
    pings: 12789,
    hasGithub: true,
    hasTwitter: true,
  },
  {
    id: 6,
    username: 'cryptokitty.near',
    payout: 50,
    agent: 'Kitty Collector',
    pings: 18456,
    hasGithub: true,
    hasTwitter: true,
  },
  {
    id: 7,
    username: '0xd8d...1234',
    payout: 40,
    agent: 'Token Trader',
    pings: 5432,
    hasGithub: true,
    hasTwitter: true,
  },
  {
    id: 8,
    username: '0xd8d...5678',
    payout: 30,
    agent: 'Yield Farmer',
    pings: 78910,
    hasGithub: true,
    hasTwitter: true,
  },
  {
    id: 9,
    username: '0xd8d...9012',
    payout: 20,
    agent: 'Lending Guru',
    pings: 22222,
    hasGithub: true,
    hasTwitter: true,
  },
  {
    id: 10,
    username: '0xd8d...3456',
    payout: 19,
    agent: 'Staking Enthusiast',
    pings: 11111,
    hasGithub: true,
    hasTwitter: true,
  },
  {
    id: 11,
    username: '0xd8d...7890',
    payout: 18,
    agent: 'DAO Member',
    pings: 36842,
    hasGithub: true,
    hasTwitter: true,
  },
  {
    id: 12,
    username: '0xd8d...2345',
    payout: 17,
    agent: 'NFT Flipper',
    pings: 55555,
    hasGithub: true,
    hasTwitter: true,
  },
];

// GET /api/earn/leaderboard - Get leaderboard data (public endpoint)
export async function GET() {
  /*   try {
    const session = await getServerSession(authOptions);

    // We could make this public, but for now let's require authentication
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // In a real implementation, we would fetch this data from the database
    // For now, just return the mock data
    return NextResponse.json(
      {
        users: MOCK_LEADERBOARD,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  } */
  // No authentication required - this is a public endpoint
  return NextResponse.json(
    {
      users: MOCK_LEADERBOARD,
    },
    { status: 200 }
  );
}
