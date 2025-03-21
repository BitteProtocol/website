import { Filters } from '@/lib/types/agent.types';
import { getNetworkMapping } from '@/lib/utils/chainIds';

const networkMapping = getNetworkMapping(true);

export const useFilters = (categories: string[]) => {
  const filters: Filters[] = [
    {
      label: 'Categories',
      values: categories.map((value) => ({
        id: value,
        name: value,
      })),
    },
    {
      label: 'Networks',
      values: Object.entries(networkMapping).map(([key, value]) => ({
        id: key,
        name: value.name,
        image: value.icon,
      })),
    },
  ];

  return filters;
};
