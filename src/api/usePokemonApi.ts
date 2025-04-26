import {Pokemon} from '../types/pokemon';
import {PagedResponse} from "../types/paging";
import {useApi} from './useApi';
import {createApiHeaders} from './apiUtils';
import {useInfiniteQuery, useQuery} from '@tanstack/react-query';

export interface PokemonQueryParams {
    pageParam?: number;
    perPage?: number;
    name?: string;
    type?: string;
    sortOrder?: 'asc' | 'desc';
}

const POKEMON_API_URL = '/api/pokemon/search';
const POKEMON_TYPES_API_URL = '/api/pokemon/types';

// Helper function to build the Pokemon API URL
const buildPokemonUrl = ({
                             pageParam = 1,
                             perPage = 20,
                             name = '',
                             type = '',
                             sortOrder = 'asc',
                         }: PokemonQueryParams): string => {
    return `${POKEMON_API_URL}?per_page=${perPage}&page=${pageParam}&name=${name}&type=${type}&sort_order=${sortOrder}`;
};

// Function for fetching Pokemon data
const fetchPokemon = async (params: PokemonQueryParams)
    : Promise<PagedResponse<Pokemon>> => {
    const url = buildPokemonUrl(params);
    const response = await fetch(url, {
        headers: createApiHeaders()
    });
    return await response.json();
};

// Custom hook for fetching Pokemon data with a regular query
export const useFetchPokemon = (params: PokemonQueryParams = {}) => {
    const {useApiQuery} = useApi();
    const url = buildPokemonUrl(params);

    return useApiQuery<PagedResponse<Pokemon>>(
        url,
        ['pokemon', params.pageParam?.toString() || '1', params.perPage?.toString() || '20',
            params.name || '', params.sortOrder || 'asc']
    );
};

// Custom hook for fetching Pokemon data with infinite query
export const useFetchPokemonInfinite =
    (name: string = '', type: string = '', sortOrder: 'asc' | 'desc' = 'asc', perPage: number = 20) => {
    return useInfiniteQuery({
        queryKey: ['pokemon', name, type, sortOrder],
        queryFn: ({pageParam}) =>
            fetchPokemon({
                pageParam,
                name,
                type,
                sortOrder,
                perPage
            }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage.meta.has_next ? lastPage.meta.next_page : undefined,
    });
};

// Function for fetching Pokemon types
const fetchPokemonTypes = async (): Promise<string[]> => {
    const response = await fetch(POKEMON_TYPES_API_URL, {
        headers: createApiHeaders()
    });
    return await response.json();
};

// Custom hook for fetching Pokemon types
export const useFetchPokemonTypes = () => {
    return useQuery({
        queryKey: ['pokemonTypes'],
        queryFn: fetchPokemonTypes
    });
};
