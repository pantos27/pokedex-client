import { useState, useMemo, useEffect } from 'react';
import { useFetchPokemonInfinite, useFetchPokemonTypes } from '../api/usePokemonApi';
import {getUrlParams, updateUrlParams} from "../utils/urlUtils.ts";

export const usePokemonData = () => {
    // Initialize state from URL parameters
    const urlParams = getUrlParams();
    const [textFilter, setTextFilter] = useState(urlParams.text);
    const [typeFilter, setTypeFilter] = useState(urlParams.type);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(urlParams.sort);

    useEffect(() => {
        updateUrlParams(textFilter, typeFilter, sortDirection);
    }, [textFilter, typeFilter, sortDirection]);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    } = useFetchPokemonInfinite(textFilter, typeFilter, sortDirection);

    const { data: types, isLoading: isLoadingTypes } = useFetchPokemonTypes();

    const flatData = useMemo(() =>
        data?.pages.flatMap(page => page.items) ?? [],
        [data]
    );

    return {
        textFilter,
        setTextFilter,
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
