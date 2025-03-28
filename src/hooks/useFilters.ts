import { Filters } from '@/lib/types/agent.types';
import { getNetworkMapping } from '@/lib/utils/chainIds';

const networkMapping = getNetworkMapping(true);

export const useFilters = (categories: string[]) => {
  const filters: Filters[] = [];

  // Add Categories filter if categories array is not empty and not just 'Networks'
  if (
    categories.length > 0 &&
    !(categories.length === 1 && categories[0] === 'Networks')
  ) {
    filters.push({
      label: 'Categories',
      values: categories.map((value) => ({
        id: value,
        name: value,
      })),
    });
  }

  // Always add Networks filter
  filters.push({
    label: 'Networks',
    values: Object.entries(networkMapping).map(([key, value]) => ({
      id: key,
      name: value.name,
      image: value.icon,
    })),
  });

  return filters;
};
