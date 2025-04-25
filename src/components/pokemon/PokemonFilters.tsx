import { ChangeEvent } from 'react';

interface PokemonFiltersProps {
  filter: string;
  sortDirection: 'asc' | 'desc';
  onFilterChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSortDirectionChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const PokemonFilters = ({
  filter,
  sortDirection,
  onFilterChange,
  onSortDirectionChange,
}: PokemonFiltersProps) => {
  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Filter by name..."
        value={filter}
        onChange={onFilterChange}
        className="filter-input"
      />
      <select
        value={sortDirection}
        onChange={onSortDirectionChange}
        className="sort-select"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
};

export default PokemonFilters;
