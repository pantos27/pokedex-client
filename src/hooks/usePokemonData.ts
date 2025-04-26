import { useState, useMemo } from 'react';
import { useFetchPokemonInfinite, useFetchPokemonTypes } from '../api/usePokemonApi';

export const usePokemonData = () => {
    const [filter, setFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    } = useFetchPokemonInfinite(filter, typeFilter, sortDirection);

    const { data: types, isLoading: isLoadingTypes } = useFetchPokemonTypes();

    const flatData = useMemo(() =>
        data?.pages.flatMap(page => page.items) ?? [],
        [data]
    );

    return {
        filter,
        setFilter,
        typeFilter,
        setTypeFilter,
        sortDirection,
        setSortDirection,
        data,
        flatData,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
        types,
        isLoadingTypes,
    };
};
