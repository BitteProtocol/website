'use client';
import { Filters as AgentFilters, RegistryData } from '@/lib/types/agent.types';
import { filterHandler } from '@/lib/utils/filters';
import { ChevronRight } from 'lucide-react';
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
import AgentCard from './AgentCard';
import Filters from './Filters';
import PlaygroundSwitch from './PlaygroundSwitch';
import { AgentData } from '@/lib/types/agent.types';

const AllAgents = (props: AgentData) => {
  if (!props) {
    return null; // Handle the null case appropriately
  }

  const { agents, filters, unverifiedAgents } = props;

  const [selectedFilters, setSelectedFilters] = useState<AgentFilters[]>([]);

  const searchParams = useSearchParams();
  const isPlayground = searchParams.get('isPlayground') === 'true';

  const handleFilterClick = (value: string, label: string) => {
    setSelectedFilters((prevFilters) =>
      filterHandler(prevFilters, value, label)
    );
  };

  const clearFilters = () => {
    setSelectedFilters([]);
  };

  const filteredAgents = selectedFilters?.length
    ? (isPlayground ? unverifiedAgents : agents).filter((agent) => {
        if (!agent) return false;

        return selectedFilters.every((filter) => {
          if (filter.label === 'Category' && agent.category) {
            return filter.values.includes(agent.category);
          }
          return true;
        });
      })
    : isPlayground
      ? unverifiedAgents
      : agents;

  return (
    <section className='w-full'>
      {/* Filters */}
      <div className='grid grid-cols-1 lg:grid-cols-5 gap-8 w-full'>
        <div className='lg:hidden'>
          <Dialog>
            <DialogTrigger className='w-full'>
              <div className='flex flex-1 items-center gap-2 border-b border-mb-gray-500 w-full pb-4'>
                <ChevronRight className='h-6 w-6' />
                Filters
              </div>
            </DialogTrigger>
            <DialogContent className='h-full bg-mb-black p-0'>
              <DialogHeader className='text-left w-full h-auto flex'>
                <div className='border-b border-mb-gray-500 p-6 bg-mb-gray-550 w-auto'>
                  <DialogTitle>Filters</DialogTitle>
                </div>
                <div className='p-4'>
                  <PlaygroundSwitch />
                </div>

                <div className='p-4 h-[70vh] overflow-scroll'>
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
        <div className='lg:col-span-4 grid-cols-1 lg-card:grid-cols-2 grid gap-8 w-full h-fit'>
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
