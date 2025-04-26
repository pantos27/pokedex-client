import { ChangeEvent } from 'react';

interface PokemonFiltersProps {
  filter: string;
  onFilterChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const PokemonFilters = ({
  filter,
  onFilterChange,
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
    </div>
  );
};

export default PokemonFilters;
