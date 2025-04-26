import React from 'react';
import PokemonTable from "../components/pokemon/PokemonTable";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/useAuth";

const Main: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <>
            <header className="header">
                <div className="header-left">
                    <h1>Pokémon Database</h1>
                </div>
                <div className="header-right">
                    {user && (
                        <div className="user-info">
                            <span>Welcome, {user.username}</span>
                            <button onClick={logout} className="logout-button">Logout</button>
                        </div>
                    )}
                    <ThemeToggle />
                </div>
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
