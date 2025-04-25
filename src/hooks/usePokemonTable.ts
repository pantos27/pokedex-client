import { useMemo, useState } from 'react';
import {
    createColumnHelper,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import { Pokemon } from '../types/pokemon';

export interface ImgErrorsState {
    [key: string]: boolean;
}

export const usePokemonTable = (data: Pokemon[]) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [imgErrors, setImgErrors] = useState<ImgErrorsState>({});

    const columnHelper = createColumnHelper<Pokemon>();

    const columns = useMemo(
        () => [
            columnHelper.accessor('icon', {
                header: 'Icon',
                size: 70,
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('name', {
                header: 'Name',
                size: 150,
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('number', {
                header: 'Number',
                size: 120,
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('type_one', {
                header: 'Type',
                size: 150,
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('hit_points', {
                header: 'HP',
                size: 70,
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('attack', {
                header: 'Attack',
                size: 90,
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('defense', {
                header: 'Defense',
                size: 90,
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('special_attack', {
                header: 'Sp. Atk',
                size: 90,
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('special_defense', {
                header: 'Sp. Def',
                size: 90,
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('speed', {
                header: 'Speed',
                size: 90,
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('total', {
                header: 'Total',
                cell: info => info.getValue(),
            }),
        ],
        [columnHelper]
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        manualSorting: true,
    });

    const handleImageError = (pokemonId: number) => {
        if (!imgErrors[pokemonId]) {
            setImgErrors(prev => ({
                ...prev,
                [pokemonId]: true
            }));
        }
    };

    return {
        table,
        imgErrors,
        handleImageError,
    };
};
