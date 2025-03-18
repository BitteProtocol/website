import { Filters as AgentFilters } from '@/lib/types/agent.types';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../accordion';
import { Badge } from '../badge';
import { Checkbox } from '../checkbox';

const Filters = ({
  selectedFilters,
  onFilterChange,
  filters,
}: {
  selectedFilters: AgentFilters[];
  onFilterChange: (value: string, label: string) => void;
  filters: AgentFilters[];
  isMobile?: boolean;
}) => {
  if (!filters?.length) return null;

  return (
    <Accordion
      type='multiple'
      defaultValue={[filters[0].label, filters[1].label]}
    >
      {filters.map((filter) => {
        const selectedAmount = selectedFilters
          .filter((selectedFilter) => selectedFilter.label === filter.label)
          .reduce((acc, curr) => acc + curr.values.length, 0);

        return (
          <AccordionItem key={filter.label} value={filter.label}>
            <AccordionTrigger>
              <div className='flex items-center justify-between w-full'>
                <div className='text-xs text-mb-gray-200'>{filter.label}</div>
                <div
                  className={cn({
                    visible: selectedAmount > 0,
                    invisible: selectedAmount === 0,
                  })}
                >
                  <Badge className='bg-mb-gray-600 text-white text-xs'>
                    {selectedAmount}
                  </Badge>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className='flex flex-col gap-2 overflow-y-auto'>
              {filter.values.map(({ id, name, image }) => (
                <div
                  key={id}
                  className='flex items-center space-x-2 bg-mb-gray-950 rounded-md py-2 px-4 hover:bg-mb-gray-250 transition-all duration-500 cursor-pointer'
                  onClick={() => onFilterChange(id, filter.label)}
                >
                  <Checkbox
                    id={id}
                    checked={selectedFilters.some(
                      (selectedFilter) =>
                        selectedFilter.label === filter.label &&
                        selectedFilter.values.some((value) => value.id === id)
                    )}
                    className='border-white'
                  />
                  {image && (
                    <div className='relative w-4 h-4'>
                      <Image
                        src={image}
                        alt={`${name} icon`}
                        fill
                        className='object-contain rounded'
                      />
                    </div>
                  )}
                  <div className='text-sm text-white font-medium'>{name}</div>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default Filters;
