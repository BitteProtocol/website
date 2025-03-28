import { RegistryData } from '../types/agent.types';
import { MB_URL } from '../url';
import { filterLocalAndTunnelUrls, networkMapping } from '../utils/network';

export const fetchVerifiedAssistants = async () => {
  try {
    const response = await fetch(`${MB_URL.REGISTRY_API_BASE}/agents`, {
      next: {
        revalidate: 36000, // Revalidate every hour (3600 seconds)
      },
    });
    if (!response.ok) {
      return { error: 'Failed to fetch verified agents' };
    }
    const result = await response.json();

    const filteredAssistants: RegistryData[] = result.filter(
      filterLocalAndTunnelUrls
    );

    const categories = [
      ...new Set(
        filteredAssistants.map((agent: RegistryData) => agent.category)
      ),
    ].filter(Boolean);

    return {
      agents: filteredAssistants as RegistryData[],
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
    return { error: err };
  }
};
