import { useState, useEffect, useCallback, useMemo } from 'react';

// Types
export interface Challenge {
  id: string;
  title: string;
  reward: number;
  frequency: 'ONE TIME' | 'DAILY' | 'WEEKLY';
  completed: boolean;
  ctaText?: string;
  ctaLink?: string;
}

export interface EarnStats {
  nextPayoutDate: string;
  totalReward: number;
}

export interface LeaderboardUser {
  id: number;
  username: string;
  hasGithub: boolean;
  hasTwitter: boolean;
  payout: number;
  agent: string;
  pings: number;
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
  const [challenges, setChallenges] = useState<Challenge[]>(MOCK_CHALLENGES);
  const [stats, setStats] = useState<EarnStats>(MOCK_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch challenges
  const fetchChallenges = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simple fetch without timeout
      const response = await fetch('/api/earn/challenges');

      if (response.ok) {
        const data = await response.json();
        if (data.challenges && data.challenges.length > 0) {
          setChallenges(data.challenges);
        }

        if (data.stats) {
          setStats(data.stats);
        }
      } else {
        console.error(
          `Failed to fetch challenges: ${response.status} ${response.statusText}`
        );
        setError('Could not load challenges');
      }

      /* 
      // The following code is commented out for future reference when implementing authentication
      // and more complex error handling with the real API
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out')), 5000);
      });
      
      // Race between fetch and timeout
      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

      if (response.ok) {
        const data = await response.json();
        if (data.challenges && data.challenges.length > 0) {
          setChallenges(data.challenges);
        } else {
          // Fallback to mock if API returns empty data
          setChallenges(MOCK_CHALLENGES);
        }
        
        if (data.stats) {
          setStats(data.stats);
        } else {
          setStats(MOCK_STATS);
        }
      } else {
        // Handle API errors with specific messages
        if (response.status === 401) {
          setError('Please log in to view challenges');
        } else {
          console.error(`Failed to fetch challenges: ${response.status} ${response.statusText}`);
          setError('Could not load challenges');
        }
        
        // Always ensure we have data to display
        setChallenges(MOCK_CHALLENGES);
        setStats(MOCK_STATS);
      }
      */
    } catch (err) {
      console.error('Error fetching challenges:', err);
      setError('Could not load challenges');

      /* 
      // Additional fallback code for future implementation
      setChallenges(MOCK_CHALLENGES);
      setStats(MOCK_STATS);
      */
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

  // Memoize the return values to prevent unnecessary re-renders
  const memoizedValues = useMemo(
    () => ({
      challenges,
      stats,
      loading,
      error,
      completeChallenge,
      refreshChallenges: fetchChallenges,
    }),
    [challenges, stats, loading, error, completeChallenge, fetchChallenges]
  );

  return memoizedValues;
}

// Leaderboard data and hook
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
  const [leaderboard, setLeaderboard] =
    useState<LeaderboardUser[]>(MOCK_LEADERBOARD);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simple fetch without timeout
      const response = await fetch('/api/earn/leaderboard');

      if (response.ok) {
        const data = await response.json();
        if (data.users && data.users.length > 0) {
          setLeaderboard(data.users);
        }
      } else {
        console.error(
          `Failed to fetch leaderboard: ${response.status} ${response.statusText}`
        );
        setError('Could not load leaderboard');
      }

      /* 
      // The following code is commented out for future reference when implementing authentication
      // and more complex error handling with the real API
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out')), 5000);
      });
      
      // Race between fetch and timeout
      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

      if (response.ok) {
        const data = await response.json();
        if (data.users && data.users.length > 0) {
          setLeaderboard(data.users);
        } else {
          // Fallback to mock if API returns empty data
          setLeaderboard(MOCK_LEADERBOARD);
        }
      } else {
        // Handle API errors with specific messages
        if (response.status === 401) {
          setError('Please log in to view the leaderboard');
        } else {
          console.error(`Failed to fetch leaderboard: ${response.status} ${response.statusText}`);
          setError('Could not load leaderboard');
        }
        
        // Always ensure we have data to display
        setLeaderboard(MOCK_LEADERBOARD);
      }
      */
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Could not load leaderboard');

      /* 
      // Additional fallback code for future implementation
      setLeaderboard(MOCK_LEADERBOARD);
      */
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
