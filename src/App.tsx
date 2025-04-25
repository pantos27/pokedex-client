import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Main from './pages/Main';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';
import './styles/theme.css';

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
        <div className="app">
            <ThemeProvider>
                <QueryClientProvider client={queryClient}>
                    <div className="page-container">
                        <Main/>
                    </div>
                </QueryClientProvider>
            </ThemeProvider>
        </div>
    );
}

export default App
