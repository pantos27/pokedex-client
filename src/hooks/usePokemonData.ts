import { useState, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPokemon } from '../api/pokemonApi';

export const usePokemonData = () => {
    const [filter, setFilter] = useState('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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

    return {
        filter,
        setFilter,
        sortDirection,
        setSortDirection,
        data,
        flatData,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    };
};
