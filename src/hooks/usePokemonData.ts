import { useState, useMemo } from 'react';
import { useFetchPokemonInfinite } from '../api/usePokemonApi';

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
    } = useFetchPokemonInfinite(filter, sortDirection);

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
