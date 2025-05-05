import { useState, useEffect, useCallback } from 'react';

// Types
export interface Challenge {
  id: string;
  title: string;
  reward: number;
  frequency: 'ONE TIME' | 'DAILY' | 'WEEKLY';
  completed: boolean;
  ctaText: string;
  ctaLink: string;
}

export interface EarnStats {
  nextPayoutDate: string;
  totalReward: number;
}

// Mock data for challenges (fallback in case API fails)
const MOCK_CHALLENGES: Challenge[] = [
  {
    id: '1',
    title: 'Secure your account with E-Mail, X and GitHub.',
    reward: 20,
    frequency: 'ONE TIME',
    completed: false,
    ctaText: 'Chat',
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

// Mock data for stats (fallback)
const MOCK_STATS: EarnStats = {
  nextPayoutDate: 'Tuesday, April 22nd',
  totalReward: 480,
};

export function useEarnChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [stats, setStats] = useState<EarnStats>(MOCK_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch challenges
  const fetchChallenges = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from API
      const response = await fetch('/api/earn/challenges');

      if (response.ok) {
        const data = await response.json();
        setChallenges(data.challenges || []);
        setStats(data.stats || MOCK_STATS);
      } else {
        // Handle API errors
        if (response.status === 401) {
          setError('Please log in to view challenges');
        } else {
          console.error('Failed to fetch challenges:', response.statusText);
          setError('Could not load challenges');
        }

        // Fallback to mock data
        setChallenges(MOCK_CHALLENGES);
        setStats(MOCK_STATS);
      }
    } catch (err) {
      // If API call fails, use mock data
      console.error('Error fetching challenges:', err);
      setChallenges(MOCK_CHALLENGES);
      setStats(MOCK_STATS);
      setError('Failed to load challenges');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load challenges on mount
  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  // Mark a challenge as completed
  const completeChallenge = useCallback(
    async (id: string) => {
      // Store original challenges to revert in case of error
      const originalChallenges = [...challenges];

      try {
        // Optimistically update UI
        setChallenges((prev) =>
          prev.map((challenge) =>
            challenge.id === id ? { ...challenge, completed: true } : challenge
          )
        );

        // Try to update via API
        const response = await fetch(`/api/earn/challenges`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ challengeId: id }),
        });

        if (!response.ok) {
          // Revert the optimistic update if API call fails
          setChallenges(originalChallenges);
          throw new Error('Failed to complete challenge');
        }

        // Refresh challenges after completion
        fetchChallenges();
        return true;
      } catch (err) {
        console.error('Error completing challenge:', err);
        // Revert to original challenges
        setChallenges(originalChallenges);
        return false;
      }
    },
    [challenges, fetchChallenges]
  );

  // For demo purposes, simulate completing challenges
  useEffect(() => {
    if (!loading && challenges.length > 0) {
      // Only complete the first challenge if it's not already completed
      const firstChallenge = challenges.find((c) => c.id === '1');
      if (firstChallenge && !firstChallenge.completed) {
        const timer = setTimeout(() => {
          completeChallenge('1');
        }, 2000);

        return () => clearTimeout(timer);
      }
    }
  }, [loading, challenges, completeChallenge]);

  return {
    challenges,
    stats,
    loading,
    error,
    completeChallenge,
    refreshChallenges: fetchChallenges,
  };
}

// Leaderboard data and hook
export interface LeaderboardUser {
  id: number;
  username: string;
  payout: number;
  agent: string;
  pings: number;
  hasGithub: boolean;
  hasTwitter: boolean;
}

// Mock leaderboard (fallback in case API fails)
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
];

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from API
      const response = await fetch('/api/earn/leaderboard');

      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.users || []);
      } else {
        // Handle API errors
        if (response.status === 401) {
          setError('Please log in to view the leaderboard');
        } else {
          console.error('Failed to fetch leaderboard:', response.statusText);
          setError('Could not load leaderboard');
        }

        // Fallback to mock data
        setLeaderboard(MOCK_LEADERBOARD);
      }
    } catch (err) {
      // If API call fails, use mock data
      console.error('Error fetching leaderboard:', err);
      setLeaderboard(MOCK_LEADERBOARD);
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return {
    leaderboard,
    loading,
    error,
    refreshLeaderboard: fetchLeaderboard,
  };
}
