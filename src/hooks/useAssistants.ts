import { BITTE_AGENTID } from '@/lib/agentConstants';
import { RegistryData } from '@/lib/types/agent.types';
import { MB_URL } from '@/lib/url';
import { useEffect, useState } from 'react';
import { useFilters } from './useFilters';

// Helper function to filter out local and tunnel URLs
const filterLocalAndTunnelUrls = (assistant: RegistryData) => {
  const id = assistant.id || '';
  const excludedDomains = [
    'loca.lt',
    'ngrok',
    'serveo',
    'local',
    'ngrok.io',
    '1ebf1221fc9232ac89c9507dbc981a20.serveo.net',
  ];
  return !excludedDomains.some((domain) => id.includes(domain));
};

export const useAssistantsByCategory = (category?: string) => {
  const [agents, setAgents] = useState<RegistryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAssistantsByCategory = async () => {
      try {
        const response = await fetch(
          `${MB_URL.REGISTRY_API_BASE}/agents?verifiedOnly=false&limit=150`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch agents');
        }
        const result = await response.json();

        const filteredAssistants = result.filter(filterLocalAndTunnelUrls);

        const categoryAgents = filteredAssistants.filter(
          (agent: RegistryData) =>
            agent.verified &&
            (!category ||
              (agent.category &&
                agent.category.toLowerCase() === category.toLowerCase()))
        );

        setAgents(categoryAgents.slice(0, 2)); // Limit to 2 agents as per original logic
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssistantsByCategory();
  }, [category]);

  return { agents, loading, error };
};

export const useVerifiedAssistants = () => {
  const [agents, setAgents] = useState<RegistryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchVerifiedAssistants = async () => {
      try {
        const response = await fetch(`${MB_URL.REGISTRY_API_BASE}/agents`);
        if (!response.ok) {
          throw new Error('Failed to fetch verified agents');
        }
        const result = await response.json();
        const filteredAssistants = result.filter(filterLocalAndTunnelUrls);
        setAgents(filteredAssistants);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchVerifiedAssistants();
  }, []);

  const filters = useFilters(
    agents.map((agent) => agent.category).filter(Boolean) as string[]
  );

  return { verifiedAgents: { agents, filters }, loading, error };
};

export const useAllAssistants = () => {
  const [verifiedAgents, setVerifiedAgents] = useState<RegistryData[]>([]);
  const [unverifiedAgents, setUnverifiedAgents] = useState<RegistryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUnverifiedAssistants = async () => {
      try {
        const response = await fetch(
          `${MB_URL.REGISTRY_API_BASE}/agents?verifiedOnly=false&limit=150`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch unverified agents');
        }
        const result = await response.json();

        const filteredAssistants = result.filter(filterLocalAndTunnelUrls);

        setVerifiedAgents(
          filteredAssistants
            .filter((agent: RegistryData) => agent.verified)
            .sort((a: RegistryData, b: RegistryData) => {
              if (a.id === BITTE_AGENTID) return -1;
              if (b.id === BITTE_AGENTID) return 1;
              return 0;
            })
        );

        setUnverifiedAgents(
          filteredAssistants.filter((agent: RegistryData) => !agent.verified)
        );
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnverifiedAssistants();
  }, []);

  const allAgents = [...verifiedAgents, ...unverifiedAgents];
  const filters = useFilters(
    allAgents.map((agent) => agent.category).filter(Boolean) as string[]
  );

  return {
    allAgents: {
      agents: verifiedAgents,
      unverifiedAgents,
      filters,
    },
    loading,
    error,
  };
};

export const useAssistantById = (agentId: string) => {
  const [agent, setAgent] = useState<RegistryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAgentById = async () => {
      try {
        const response = await fetch(
          `${MB_URL.REGISTRY_API_BASE}/agents/${agentId}`
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

export const useMyAssistants = (accountId: string | null) => {
  const [agents, setAgents] = useState<RegistryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMyAssistants = async () => {
      try {
        const response = await fetch(
          `${MB_URL.REGISTRY_API_BASE}/agents?accountId=${accountId}&verifiedOnly=false`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch my agents');
        }
        const result = await response.json();

        setAgents(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    if (accountId) {
      fetchMyAssistants();
    }
  }, [accountId]);

  return { agents, loading, error };
};
