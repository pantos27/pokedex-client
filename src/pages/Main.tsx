import React from 'react';
import PokemonTable from "../components/PokemonTable.tsx";

const Main: React.FC = () => {
    return (
        <>
            <header className="header">
                <h1>Pokémon Database</h1>
            </header>
            <main className="main">
                <PokemonTable/>
            </main>
            <footer className="footer">
                <p>Data provided by Pokémon API</p>
            </footer>
        </>
    );
};

export default Main;

