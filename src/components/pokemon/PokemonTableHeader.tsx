import { HeaderGroup, flexRender } from '@tanstack/react-table';
import { Pokemon } from '../../types/pokemon';

interface PokemonTableHeaderProps {
  headerGroups: HeaderGroup<Pokemon>[];
}

const PokemonTableHeader = ({ headerGroups }: PokemonTableHeaderProps) => {
  return (
    <thead>
      {headerGroups.map(headerGroup => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map(header => (
            <th
              key={header.id}
              onClick={header.column.getToggleSortingHandler()}
              style={{
                width: header.getSize() ? `${header.getSize()}px` : 'auto',
                flex: header.getSize() ? `0 0 ${header.getSize()}px` : '1 0 auto',
              }}
            >
              {flexRender(
                header.column.columnDef.header,
                header.getContext()
              )}
              {{
                asc: ' 🔼',
                desc: ' 🔽',
              }[header.column.getIsSorted() as string] ?? null}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
};

export default PokemonTableHeader;
