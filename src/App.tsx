import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Main from './pages/Main';
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
        <div className="app">
            <QueryClientProvider client={queryClient}>
                <div className="page-container">
                    <Main/>
                </div>
            </QueryClientProvider>
        </div>
    );
}

export default App
