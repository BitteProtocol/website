import { useState, useEffect } from 'react';
import { RegistryData, Filters } from '@/lib/types/agent.types';

export const useAssistants = () => {
  const [data, setData] = useState<{
    agents: RegistryData[];
    unverifiedAgents: RegistryData[];
    filters: Filters[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        const response = await fetch(
          'https://registry-gules.vercel.app/api/agents'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch agents');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssistants();
  }, []);

  return { data, loading, error };
};

export const useAssistantById = (agentId: string) => {
  const [agent, setAgent] = useState<RegistryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAgentById = async () => {
      try {
        const response = await fetch(
          `https://registry-gules.vercel.app/api/agents/${agentId}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch agent by ID');
        }
        const result = await response.json();
        setAgent(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    if (agentId) {
      fetchAgentById();
    }
  }, [agentId]);

  return { agent, loading, error };
};
