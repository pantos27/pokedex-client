import { Pokemon } from '../types/pokemon';
import { PagedResponse } from "../types/paging";

export interface PokemonQueryParams {
    pageParam?: number;
    perPage?: number;
    name?: string;
    sortOrder?: 'asc' | 'desc';
}

export const fetchPokemon = async ({
    pageParam = 1,
    perPage = 20,
    name = '',
    sortOrder = 'asc',
}: PokemonQueryParams): Promise<PagedResponse<Pokemon>> => {
    const url = `http://localhost:8080/search?per_page=${perPage}&page=${pageParam}&name=${name}&sort_order=${sortOrder}`;
    const response = await fetch(url);
    const data = await response.json();
    return data[0];
};
