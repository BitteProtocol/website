import { useState, useEffect } from 'react';
import { RegistryData, Filters, AgentData } from '@/lib/types/agent.types';

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

/* export const useAssistants = (fetchAll: boolean) => {
  const [data, setData] = useState<AgentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        const response = await fetch(
          `https://registry-gules.vercel.app/api/agents?verifiedOnly=${!fetchAll}&limit=${fetchAll ? '100' : '50'}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch agents');
        }
        const result = await response.json();

        const filteredAssistants = result.filter(filterLocalAndTunnelUrls);
        console.log('FILTERED ASS', filteredAssistants);

        if (fetchAll) {
          const unverifiedAgents = filteredAssistants.filter(
            (agent: RegistryData) => !agent.verified
          );

          const categories = [
            ...new Set(
              filteredAssistants.map((agent: RegistryData) => agent.category)
            ),
          ].filter(Boolean);

          setData({
            unverifiedAgents: unverifiedAgents,
            filters: [
              {
                label: 'Category',
                values: categories as string[],
              },
            ],
          });
        } else {
          const verifiedAgents = filteredAssistants.filter(
            (agent: RegistryData) => agent.verified
          );

          const categories = [
            ...new Set(
              verifiedAgents.map((agent: RegistryData) => agent.category)
            ),
          ].filter(Boolean);

          setData({
            agents: verifiedAgents,
            filters: [
              {
                label: 'Category',
                values: categories as string[],
              },
            ],
          });
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssistants();
  }, [fetchAll]);

  return { data, loading, error };
}; */

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
        const response = await fetch(
          'https://registry-gules.vercel.app/api/agents'
        );
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

export const useAllAssistants = () => {
  const [data, setData] = useState<AgentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUnverifiedAssistants = async () => {
      try {
        const response = await fetch(
          'https://registry-gules.vercel.app/api/agents?verifiedOnly=false&limit=100'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch unverified agents');
        }
        const result = await response.json();

        const filteredAssistants = result.filter(filterLocalAndTunnelUrls);
        console.log('FILTERED ASS', filteredAssistants);

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

        setData({
          agents: verifiedAgents,
          unverifiedAgents: unverifiedAgents,
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

    fetchUnverifiedAssistants();
  }, []);

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
