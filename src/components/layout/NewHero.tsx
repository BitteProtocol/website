import { RegistryData } from '@/lib/types/agent.types';
import { MB_URL } from '@/lib/url';
import '@bitte-ai/chat/style.css';
import { cookies } from 'next/headers';
import { getNetworkMapping } from '@/lib/utils/chainIds';
import { Hero } from './HeroComponent';
// Utility function to filter URLs (assuming this exists in your original code)

// Network mapping (assuming this exists in your original code)
const networkMapping = getNetworkMapping(true);

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

async function fetchVerifiedAssistants() {
  try {
    const response = await fetch(`${MB_URL.REGISTRY_API_BASE}/agents`, {
      next: {
        revalidate: 36000, // Revalidate every hour (3600 seconds)
      },
    });
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

    return {
      agents: filteredAssistants,
      filters: [
        {
          label: 'Categories',
          values: (categories as string[]).map((value) => {
            return {
              id: value,
              name: value,
            };
          }),
        },
        {
          label: 'Networks',
          values: Object.entries(networkMapping).map(([key, value]) => {
            return { id: key, name: value.name, image: value.icon };
          }),
        },
      ],
    };
  } catch (err) {
    console.error('Error fetching verified agents:', err);
    return {
      agents: [],
      filters: [],
    };
  }
}

export default async function NewHero() {
  const agentData = await fetchVerifiedAssistants();

  // Get selected agent from cookies instead of sessionStorage
  const cookieStore = cookies();
  const selectedAgentCookie = cookieStore.get('selectedAgent');
  let selectedAgent = agentData?.agents?.[0] || null;

  if (selectedAgentCookie) {
    try {
      selectedAgent = JSON.parse(selectedAgentCookie.value);
    } catch (e) {
      console.error('Error parsing selectedAgent cookie:', e);
    }
  }

  return <Hero agentData={agentData} selectedAgent={selectedAgent} />;
}
