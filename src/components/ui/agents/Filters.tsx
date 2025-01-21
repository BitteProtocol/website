import { Filters as AgentFilters } from '@/lib/types/agent.types';
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
  isHome,
}: {
  selectedFilters: AgentFilters[];
  onFilterChange: (value: string, label: string) => void;
  filters: AgentFilters[];
  isMobile?: boolean;
  isHome?: boolean;
}) => {
  if (!filters?.length) return null;

  return isHome ? (
    <div className='flex flex-row gap-2 items-center lg:justify-center overflow-x-auto disable-scrollbars h-full scroll-smooth whitespace-nowrap'>
      {filters.map((filter) =>
        filter.values.map((value: string) => {
          const isSelected = selectedFilters.some(
            (selectedFilter) =>
              selectedFilter.label === filter.label &&
              selectedFilter.values.includes(value)
          );
          return (
            <button
              key={`${filter.label}-${value}`}
              className={`first:ml-6 lg:first:ml-0 last:mr-6 lg:last:mr-0 px-4 py-2 flex shrink-0 justify-center rounded-full min-w-[70px] text-xs md:text-sm ${
                isSelected
                  ? 'bg-[#261A32] text-[#C084FC] border border-[#C084FC]'
                  : 'bg-[#18181A] text-[#B5B5B5]'
              } hover:border hover:border-[#C084FC]`}
              onClick={() => onFilterChange(value, filter.label)}
            >
              {value}
            </button>
          );
        })
      )}
    </div>
  ) : (
    <Accordion
      type='single'
      className='text-mb-gray-200'
      collapsible
      defaultValue={filters[0].label}
    >
      {filters.map((filter, index) => {
        const selectedAmount = selectedFilters?.filter(
          (selectedFilter) => selectedFilter.label === filter.label
        )?.[0]?.values?.length;
        return (
          <AccordionItem
            key={filter.label}
            value={filter.label}
            className={`border-mb-gray-500 ${index === 0 ? 'border-t' : ''}`}
          >
            <AccordionTrigger>
              <div className='flex items-center justify-between w-full'>
                <div>{filter.label}</div>
                {selectedAmount ? (
                  <Badge className='bg-mb-gray-600 text-mb-gray-200'>
                    {selectedAmount}
                  </Badge>
                ) : null}
              </div>
            </AccordionTrigger>
            <AccordionContent className='flex flex-col gap-2'>
              {filter.values.map((value: string) => (
                <div
                  key={value}
                  className='flex items-center space-x-2 bg-mb-gray-950 rounded-md py-4 px-6 hover:bg-mb-gray-250 transition-all duration-500 cursor-pointer'
                  onClick={() => onFilterChange(value, filter?.label)}
                >
                  <Checkbox
                    id={value}
                    checked={
                      selectedFilters.filter(
                        (selectedFilter) =>
                          selectedFilter.label === filter.label &&
                          selectedFilter.values.includes(value)
                      ).length > 0
                    }
                    className='border-white'
                  />
                  <div className='text-sm font-medium leading-none'>
                    {value}
                  </div>
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
