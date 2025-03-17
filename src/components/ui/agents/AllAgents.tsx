'use client';
import { AgentData, Filters as AgentFilters } from '@/lib/types/agent.types';
import { filterHandler } from '@/lib/utils/filters';
import { ListFilter, SearchIcon } from 'lucide-react';
import { useSearchParams } from 'next/dist/client/components/navigation';
import { useState } from 'react';
import { Button } from '../button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../dialog';
import { Input } from '../input';
import AgentCard from './AgentCard';
import Filters from './Filters';
import PlaygroundSwitch from './PlaygroundSwitch';

const AllAgents = (props: AgentData) => {
  const [selectedFilters, setSelectedFilters] = useState<AgentFilters[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  const searchParams = useSearchParams();
  const isPlayground = searchParams.get('isPlayground') === 'true';

  const { agents = [], filters = [], unverifiedAgents = [] } = props || {};

  const handleFilterClick = (value: string, label: string) => {
    setSelectedFilters((prevFilters) =>
      filterHandler(prevFilters, value, label)
    );
  };

  const clearFilters = () => {
    setSelectedFilters([]);
  };

  const filteredAgents = (isPlayground ? unverifiedAgents : agents).filter(
    (agent) => {
      if (!agent) return false;

      // Check if agent matches all selected filters
      const matchesFilters = selectedFilters.every((filter) => {
        if (filter.label === 'Categories' && agent.category) {
          return filter.values.some((value) => value.name === agent.category);
        } else if (filter.label === 'Networks' && agent.chainIds) {
          return agent.chainIds.some((chainId) =>
            filter.values.some((value) => value.id === chainId.toString())
          );
        }
        return true;
      });

      // Check if agent name includes the search keyword
      const matchesSearch = searchKeyword.length
        ? agent.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          agent.id.toLowerCase().includes(searchKeyword.toLowerCase())
        : true;

      return matchesFilters && matchesSearch;
    }
  );

  if (!props) {
    return <></>;
  }

  return (
    <section className='w-full'>
      {/* Filters */}
      <div className='grid grid-cols-1 lg:grid-cols-5 gap-8 w-full'>
        <div className='lg:hidden'>
          <Dialog>
            <DialogTrigger className='w-full'>
              <div className='flex flex-1 items-center gap-2 border-b border-mb-gray-500 w-full pb-4'>
                <ListFilter className='h-5 w-5' />
                Filters
              </div>
            </DialogTrigger>
            <DialogContent className='h-full bg-mb-black p-0'>
              <DialogHeader className='text-left w-full h-auto flex'>
                <div className='border-b border-mb-gray-500 p-6 bg-mb-gray-550 w-auto'>
                  <DialogTitle>Filters</DialogTitle>
                </div>
                <div className='px-4 pt-4'>
                  <PlaygroundSwitch />
                </div>

                <div className='pt-0 lg:pt-4 p-4 h-[70vh] overflow-scroll'>
                  <Filters
                    filters={filters}
                    selectedFilters={selectedFilters}
                    onFilterChange={handleFilterClick}
                    isMobile
                  />
                </div>
              </DialogHeader>

              <DialogFooter className='bg-mb-black'>
                <DialogClose className='py-4 px-6 border-t border-mb-gray-500 w-full'>
                  <div className='flex gap-4 w-full items-center'>
                    <Button
                      type='button'
                      variant='secondary'
                      className='w-full bg-mb-gray-600'
                      onClick={clearFilters}
                    >
                      Clear
                    </Button>
                    <Button type='button' variant='default' className='w-full'>
                      Apply
                    </Button>
                  </div>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className='col-span-1 hidden lg:block w-full'>
          <div className='mb-6 hidden lg:flex lg:items-center lg:justify-between w-full sticky top-20'>
            <p className='text-mb-gray-200 text-xs font-semibold'>Filters</p>
            <Button
              variant='ghost'
              onClick={clearFilters}
              className={`${selectedFilters?.length ? 'visible' : 'invisible'} text-xs`}
            >
              Clear
            </Button>
          </div>
          <div className='mb-6 sticky top-36'>
            <PlaygroundSwitch />
          </div>

          <div className='sticky top-48'>
            <Filters
              filters={filters}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterClick}
            />
          </div>
        </div>

        <div className='lg:col-span-4 grid-cols-1 lg-card:grid-cols-2 grid gap-6 w-full h-fit'>
          <div className='relative mt-2 h-fit'>
            <SearchIcon
              className='pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground'
              size={18}
            />
            <Input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder='Search'
              className='pl-8'
            />
          </div>
          <div className='hidden lg:block'></div>

          {filteredAgents?.length ? (
            filteredAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))
          ) : (
            <p>No agents found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AllAgents;
