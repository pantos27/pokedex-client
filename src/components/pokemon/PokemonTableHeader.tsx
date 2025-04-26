import { HeaderGroup, flexRender } from '@tanstack/react-table';
import { Pokemon } from '../../types/pokemon';

interface PokemonTableHeaderProps {
  headerGroups: HeaderGroup<Pokemon>[];
  sortDirection: 'asc' | 'desc';
  setSortDirection: (direction: 'asc' | 'desc') => void;
}

const PokemonTableHeader = ({
  headerGroups,
  sortDirection,
  setSortDirection
}: PokemonTableHeaderProps) => {

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  return (
    <thead>
      {headerGroups.map(headerGroup => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map(header => {
            const isNumberColumn = header.id.includes('number');

            return (
              <th
                key={header.id}
                onClick={isNumberColumn ? toggleSortDirection : undefined}
                style={{
                  width: header.getSize() ? `${header.getSize()}px` : 'auto',
                  flex: header.getSize() ? `0 0 ${header.getSize()}px` : '1 0 auto',
                  cursor: isNumberColumn ? 'pointer' : 'default',
                }}
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
                {isNumberColumn && (
                  sortDirection === 'asc' ? ' 🔼' : ' 🔽'
                )}
              </th>
            );
          })}
        </tr>
      ))}
    </thead>
  );
};

export default PokemonTableHeader;
