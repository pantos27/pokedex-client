import {useCallback, useEffect, useState, useMemo, ChangeEvent} from 'react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import {useVirtualizer} from '@tanstack/react-virtual';
import {useInfiniteQuery} from '@tanstack/react-query';
import {Pokemon} from '../types/pokemon';
import {PagedResponse} from "../types/paging.ts";

const ICON_PLACEHOLDER = 'poke_ball.svg';

const fetchPokemon = async ({
                                pageParam = 1,
                                perPage = 20,
                                name = '',
                                sortOrder = 'asc',
                            }: {
    pageParam?: number;
    perPage?: number;
    name?: string;
    sortOrder?: 'asc' | 'desc';
}): Promise<PagedResponse<Pokemon>> => {
    const url = `http://127.0.0.1:5000/search?per_page=${perPage}&page=${pageParam}&name=${name}&sort_order=${sortOrder}`;
    const response = await fetch(url);
    const data = await response.json();
    return data[0];
};

const columnHelper = createColumnHelper<Pokemon>();

const PokemonTable = () => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [filter, setFilter] = useState('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ['pokemon', filter, sortDirection],
        queryFn: ({pageParam}) =>
            fetchPokemon({
                pageParam,
                name: filter,
                sortOrder: sortDirection
            }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage.meta.has_next ? lastPage.meta.next_page : undefined,
    });

    const flatData = useMemo(() =>
            data?.pages.flatMap(page => page.items) ?? [],
        [data]
    );

    const columns = useMemo(
        () => [
            columnHelper.accessor('icon', {
                header: 'Icon',
                size: 70,
                cell: info => {
                    const pokemonId = info.row.original.id;
                    const hasError = imgErrors[pokemonId];

                    return (
                        <img
                            src={hasError ? ICON_PLACEHOLDER : info.getValue()}
                            alt={`${info.row.original.name} icon`}
                            width={40}
                            height={40}
                            onError={() => {
                                if (!imgErrors[pokemonId]) {
                                    setImgErrors(prev => ({
                                        ...prev,
                                        [pokemonId]: true
                                    }));
                                }
                            }}
                        />
                    )
                },
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
                cell: info => (
                    <div>
                        {info.getValue()}
                        {info.row.original.type_two && ` / ${info.row.original.type_two}`}
                    </div>
                ),
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
        [imgErrors]
    );

    const table = useReactTable({
        data: flatData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        manualSorting: true,
    });

    const parentRef = useMemo(() => ({current: null as HTMLDivElement | null}), []);

    const tableContainerRef = useCallback((node: HTMLDivElement | null) => {
        if (node) parentRef.current = node;
    }, [parentRef]);

    const virtualizer = useVirtualizer({
        count: flatData.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 50,
        overscan: 10,
    });

    const handleScroll = useCallback(() => {
        const {scrollHeight, scrollTop, clientHeight} = parentRef.current!;

        // When the user scrolls to 80% of the way down, fetch more data
        if (
            !isFetching &&
            !isFetchingNextPage &&
            hasNextPage &&
            scrollHeight - scrollTop - clientHeight < scrollHeight * 0.2
        ) {
            fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, parentRef]);

    useEffect(() => {
        const scrollElement = parentRef.current;
        if (scrollElement) {
            scrollElement.addEventListener('scroll', handleScroll);
            return () => scrollElement.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll, parentRef]);

    const loadingText = useMemo(() =>
            <div className="loading">Loading Pokémon data...</div>
        , []);

    const errorText = useMemo(() =>
            <div className="error">Error loading Pokémon data</div>
        , []);

    const emptyText = useMemo(() =>
            <div className="empty">No pokemons found</div>
        , []);


    const handleSortDirectionChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSortDirection(e.target.value as 'asc' | 'desc');
    };

    const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilter(e.target.value);
    };

    // Define the row virtualization component with the correct HTML structure
    const VirtualRows = () => {
        const items = virtualizer.getVirtualItems();

        return (
            <>
                {items.map(virtualRow => {
                    const row = table.getRowModel().rows[virtualRow.index];
                    if (!row) return null;

                    return (
                        <tr
                            key={row.id}
                            data-index={virtualRow.index}
                            style={{
                                height: `${virtualRow.size}px`,
                                transform: `translateY(${virtualRow.start}px)`,
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                display: 'flex',
                            }}
                        >
                            {row.getVisibleCells().map(cell => (
                                <td
                                    key={cell.id}
                                    style={{
                                        width: cell.column.getSize() ? `${cell.column.getSize()}px` : 'auto',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        flex: cell.column.getSize() ? `0 0 ${cell.column.getSize()}px` : '1 0 auto',
                                        boxSizing: 'border-box',
                                    }}
                                >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>

                    );
                })}
            </>
        );
    };

    return (
        <div className="pokemon-table-container">
            <div className="filters">
                <input
                    type="text"
                    placeholder="Filter by name..."
                    value={filter}
                    onChange={handleFilterChange}
                    className="filter-input"
                />
                <select
                    value={sortDirection}
                    onChange={handleSortDirectionChange}
                    className="sort-select"
                >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>

            {status === 'pending' ? (loadingText)
                : status === 'error' ? (errorText)
                    : flatData.length === 0 ? (emptyText)
                        : <div
                            ref={tableContainerRef}
                            className="table-container"
                            style={{
                                height: '600px',
                                overflow: 'auto',
                                position: 'relative'
                            }}
                        >
                            <table
                                style={{
                                    width: '100%',
                                    tableLayout: 'fixed',
                                    borderCollapse: 'collapse',
                                    border: 'none'
                                }}>
                                <thead>
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <th
                                                key={header.id}
                                                onClick={header.column.getToggleSortingHandler()}
                                                style={{
                                                    cursor: 'pointer',
                                                    width: header.getSize() ? `${header.getSize()}px` : 'auto',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    flex: header.getSize() ? `0 0 ${header.getSize()}px` : '1 0 auto',
                                                    boxSizing: 'border-box',
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
                                <tbody style={{position: 'relative', height: `${virtualizer.getTotalSize()}px`}}>
                                <VirtualRows/>
                                </tbody>
                            </table>

                            {isFetchingNextPage && (
                                <div className="loading-more">Loading more Pokémon...</div>
                            )}
                        </div>
            }
        </div>
    );
};

export default PokemonTable;
