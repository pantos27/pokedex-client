export interface Pokemon {
    id: number;
    name: string;
    number: number;
    attack: number;
    defense: number;
    special_attack: number;
    special_defense: number;
    speed: number;
    hit_points: number;
    total: number;
    generation: number;
    type_one: string;
    type_two: string;
    legendary: boolean;
    icon: string;
    image: string;
}
