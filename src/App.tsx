import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PokemonTable from './components/PokemonTable';
import './App.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false,
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="app">
                <header className="header">
                    <h1>Pokémon Database</h1>
                </header>
                <main className="main">
                    <PokemonTable />
                </main>
                <footer className="footer">
                    <p>Data provided by Pokémon API</p>
                </footer>
            </div>
        </QueryClientProvider>
    );
}

export default App
