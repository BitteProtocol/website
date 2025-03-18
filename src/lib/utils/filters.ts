import { Filters } from '../types/agent.types';

export const filterHandler = (
  prevFilters: Filters[],
  value: string, // Assuming this is now an object identifier
  label: string
): Filters[] => {
  const filterIndex = prevFilters.findIndex((filter) => filter.label === label);

  if (filterIndex !== -1) {
    // If the filter with the label exists
    const updatedFilters = [...prevFilters];
    let filterValues = updatedFilters[filterIndex].values;

    // Assuming values are now objects with an 'id' property
    const valueIndex = filterValues.findIndex((v) => v.id === value);

    if (valueIndex !== -1) {
      // Value exists, remove it
      filterValues = filterValues.filter((_, index) => index !== valueIndex);
    } else {
      // Value doesn't exist, add it
      // Assuming 'value' is the 'id' of the new object to be added
      filterValues = [...filterValues, { id: value, name: 'New Value' }]; // Adjust object structure as needed
    }

    // Update the values for the label
    updatedFilters[filterIndex] = {
      ...updatedFilters[filterIndex],
      values: filterValues,
    };

    if (filterValues.length === 0) {
      // If there are no values left for the label, remove the entire filter
      updatedFilters.splice(filterIndex, 1);
    }

    return updatedFilters;
  } else {
    // If the filter with the label doesn't exist, add a new filter
    // Adjust the new value object structure as needed
    return [
      ...prevFilters,
      { label, values: [{ id: value, name: 'New Value' }] },
    ];
  }
};
