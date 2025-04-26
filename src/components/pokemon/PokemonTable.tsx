import { ChangeEvent, useState, useEffect } from 'react';
import { usePokemonData } from '../../hooks/usePokemonData';
import { usePokemonTable } from '../../hooks/usePokemonTable';
import { useVirtualTable } from '../../hooks/useVirtualTable';
import { useDebounce } from '../../hooks/useDebounce';
import { Pokemon } from '../../types/pokemon';
import PokemonFilters from './PokemonFilters';
import PokemonTableHeader from './PokemonTableHeader';
import VirtualRows from './VirtualRows';
import StatusMessages from './StatusMessages';
import PokemonModal from './PokemonModal';
import '../../styles/PokemonTable.css';

const PokemonTable = () => {
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const {
    setTextFilter,
    typeFilter,
    setTypeFilter,
    sortDirection,
    setSortDirection,
    flatData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    types,
    isLoadingTypes,
  } = usePokemonData();

  // Debounce the input value
  const debouncedInputValue = useDebounce(inputValue, 300);

  const { table, imgErrors, handleImageError } = usePokemonTable(flatData);

  const { tableContainerRef, virtualizer } = useVirtualTable({
    count: flatData.length,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  });

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Update the filter when the debounced input value changes
  useEffect(() => {
    setTextFilter(debouncedInputValue);
  }, [debouncedInputValue, setTextFilter]);

  const handleTypeFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value);
  };

  const handleClearFilters = () => {
    setInputValue('');
    setTextFilter('');
    setTypeFilter('');
  };

  const handleRowClick = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  return (
    <div className="pokemon-table-container">
      <PokemonFilters
        textFilter={inputValue}
        onFilterChange={handleFilterChange}
        typeFilter={typeFilter}
        onTypeFilterChange={handleTypeFilterChange}
        types={types}
        isLoadingTypes={isLoadingTypes}
        onClearFilters={handleClearFilters}
      />

      {status !== 'success' || flatData.length === 0 ? (
        <StatusMessages
          status={status}
          isEmpty={flatData.length === 0}
        />
      ) : (
        <div
          ref={tableContainerRef}
          className="table-container"
        >
          <table className="pokemon-table">
            <PokemonTableHeader
              headerGroups={table.getHeaderGroups()}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
            />
            <tbody style={{ position: 'relative', height: `${virtualizer.getTotalSize()}px` }}>
              <VirtualRows
                virtualizer={virtualizer}
                rows={table.getRowModel().rows}
                imgErrors={imgErrors}
                onImageError={handleImageError}
                onRowClick={handleRowClick}
              />
            </tbody>
          </table>

          {isFetchingNextPage && (
            <div className="loading-more">Loading more Pokémon...</div>
          )}
        </div>
      )}

      <PokemonModal
        pokemon={selectedPokemon}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default PokemonTable;
