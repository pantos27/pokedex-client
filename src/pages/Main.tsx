import React from 'react';
import PokemonTable from "../components/PokemonTable.tsx";
import ThemeToggle from "../components/ThemeToggle";

const Main: React.FC = () => {
    return (
        <>
            <header className="header">
                <h1>Pokémon Database</h1>
                <ThemeToggle />
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
