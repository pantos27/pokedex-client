export interface User {
    id: string;
    username: string;
    capturedPokemon: Capture[];
}

interface Capture {
    date_created: Date;
    pokemon_id: number;
}
