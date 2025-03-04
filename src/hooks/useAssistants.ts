import { useState, useEffect } from 'react';
import { RegistryData, Filters, AgentData } from '@/lib/types/agent.types';
import { MB_URL } from '@/lib/url';

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
          `${MB_URL.REGISTRY_API_BASE}/agents?verifiedOnly=false&limit=100`
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
  const [data, setData] = useState<{
    agents: RegistryData[];
    filters: Filters[];
  } | null>(null);
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

        const categories = [
          ...new Set(
            filteredAssistants.map((agent: RegistryData) => agent.category)
          ),
        ].filter(Boolean);

        setData({
          agents: filteredAssistants,
          filters: [
            {
              label: 'Category',
              values: categories as string[],
            },
          ],
        });
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchVerifiedAssistants();
  }, []);

  return { verifiedAgents: data, loading, error };
};

export const useAllAssistants = (offset?: number, limit?: number) => {
  const [data, setData] = useState<AgentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUnverifiedAssistants = async () => {
      try {
        const response = await fetch(
          `${MB_URL.REGISTRY_API_BASE}/agents?verifiedOnly=false&limit=${limit ? limit : 100}&offset=${offset ? offset : 0}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch unverified agents');
        }
        const result = await response.json();

        const filteredAssistants = result.filter(filterLocalAndTunnelUrls);

        const verifiedAgents = filteredAssistants.filter(
          (agent: RegistryData) => agent.verified
        );
        const unverifiedAgents = filteredAssistants.filter(
          (agent: RegistryData) => !agent.verified
        );

        const categories = [
          ...new Set(
            filteredAssistants.map((agent: RegistryData) => agent.category)
          ),
        ].filter(Boolean);

        setData((prevData) => ({
          agents: [...(prevData?.agents || []), ...verifiedAgents],
          unverifiedAgents: [
            ...(prevData?.unverifiedAgents || []),
            ...unverifiedAgents,
          ],
          filters: [
            {
              label: 'Category',
              values: categories as string[],
            },
          ],
        }));
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnverifiedAssistants();
  }, [offset, limit]);

  return { allAgents: data, loading, error };
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
