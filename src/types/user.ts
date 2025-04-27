export interface User {
    id: string;
    username: string;
    capturedPokemon: Capture[];
}

export interface Capture {
    date_created: string;
    pokemon_id: number;
}
