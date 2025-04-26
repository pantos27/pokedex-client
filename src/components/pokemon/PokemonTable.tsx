import { ChangeEvent } from 'react';
import { usePokemonData } from '../../hooks/usePokemonData';
import { usePokemonTable } from '../../hooks/usePokemonTable';
import { useVirtualTable } from '../../hooks/useVirtualTable';
import PokemonFilters from './PokemonFilters';
import PokemonTableHeader from './PokemonTableHeader';
import VirtualRows from './VirtualRows';
import StatusMessages from './StatusMessages';
import '../../styles/PokemonTable.css';

const PokemonTable = () => {
  const {
    filter,
    setFilter,
    sortDirection,
    setSortDirection,
    flatData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = usePokemonData();

  const { table, imgErrors, handleImageError } = usePokemonTable(flatData);

  const { tableContainerRef, virtualizer } = useVirtualTable({
    count: flatData.length,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  });

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };


  return (
    <div className="pokemon-table-container">
      <PokemonFilters
        filter={filter}
        onFilterChange={handleFilterChange}
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
              />
            </tbody>
          </table>

          {isFetchingNextPage && (
            <div className="loading-more">Loading more Pokémon...</div>
          )}
        </div>
      )}
    </div>
  );
};

export default PokemonTable;
