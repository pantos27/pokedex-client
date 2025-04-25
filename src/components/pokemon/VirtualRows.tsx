import {Row, flexRender, Cell} from '@tanstack/react-table';
import {Virtualizer} from '@tanstack/react-virtual';
import {Pokemon} from '../../types/pokemon';
import {ICON_PLACEHOLDER} from '../../constants';
import {ImgErrorsState} from '../../hooks/usePokemonTable';
import {useCallback} from "react";
import * as React from "react";

interface VirtualRowsProps {
    virtualizer: Virtualizer<HTMLDivElement, Element>;
    rows: Row<Pokemon>[];
    imgErrors: ImgErrorsState;
    onImageError: (pokemonId: number) => void;
}

const VirtualRows = ({virtualizer, rows, imgErrors, onImageError}: VirtualRowsProps) => {
    const items = virtualizer.getVirtualItems();

    const cellWrapper = useCallback((cell: Cell<Pokemon, unknown>, element: React.ReactNode) => (
        <td
            key={cell.id}
            style={{
                width: cell.column.getSize() ? `${cell.column.getSize()}px` : 'auto',
                flex: cell.column.getSize() ? `0 0 ${cell.column.getSize()}px` : '1 0 auto',
            }}
        >
            {element}
        </td>
    ), []);

    return (
        <>
            {items.map(virtualRow => {
                const row = rows[virtualRow.index];
                if (!row) return null;

                return (
                    <tr
                        key={row.id}
                        data-index={virtualRow.index}
                        className="virtual-row"
                        style={{
                            height: `${virtualRow.size}px`,
                            transform: `translateY(${virtualRow.start}px)`,
                        }}
                    >
                        {row.getVisibleCells().map(cell => {
                            // Special handling for icon column
                            if (cell.column.id === 'icon') {
                                const pokemonId = row.original.id;
                                const hasError = imgErrors[pokemonId];
                                const iconUrl = cell.getValue() as string;
                                return cellWrapper(cell, (<img
                                    src={hasError ? ICON_PLACEHOLDER : iconUrl}
                                    alt={`${row.original.name} icon`}
                                    width={40}
                                    height={40}
                                    onError={() => onImageError(pokemonId)}
                                />));
                            }

                            // Special handling for type column
                            if (cell.column.id === 'type_one') {
                                return cellWrapper(cell, (
                                    <div>
                                        {cell.getValue() as string}
                                        {row.original.type_two && ` / ${row.original.type_two}`}
                                    </div>
                                ));
                            }

                            // Default rendering for other columns
                            return cellWrapper(cell, flexRender(cell.column.columnDef.cell, cell.getContext()))
                        })}
                    </tr>
                );
            })}
        </>
    );
};

export default VirtualRows;
