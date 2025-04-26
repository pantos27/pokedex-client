import { ChangeEvent } from 'react';

interface PokemonFiltersProps {
  textFilter: string;
  onFilterChange: (e: ChangeEvent<HTMLInputElement>) => void;
  typeFilter: string;
  onTypeFilterChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  types?: string[];
  isLoadingTypes: boolean;
  onClearFilters: () => void;
}

const PokemonFilters = ({
  textFilter,
  onFilterChange,
  typeFilter,
  onTypeFilterChange,
  types = [],
  isLoadingTypes,
  onClearFilters,
}: PokemonFiltersProps) => {
  return (
    <div className="filters">
      <div className="filter-inputs">
        <input
          type="text"
          placeholder="Filter by name..."
          value={textFilter}
          onChange={onFilterChange}
          className="filter-input"
        />
        <select
          value={typeFilter}
          onChange={onTypeFilterChange}
          className="type-filter-select"
          disabled={isLoadingTypes}
        >
          <option value="">All Types</option>
          {types.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      {(textFilter || typeFilter) && (
        <button
          onClick={onClearFilters}
          className="clear-filters-button"
          aria-label="Clear filters"
        >
          <span className="clear-icon">X</span> Clear
        </button>
      )}
    </div>
  );
};

export default PokemonFilters;
