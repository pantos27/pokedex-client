
// Helper function to get URL parameters
export const getUrlParams = () => {
    const searchParams = new URLSearchParams(window.location.search);
    return {
        text: searchParams.get('text') || '',
        type: searchParams.get('type') || '',
        sort: (searchParams.get('sort') as 'asc' | 'desc') || 'asc'
    };
};

// Helper function to update URL parameters
export const updateUrlParams = (text: string, type: string, sort: 'asc' | 'desc') => {
    const searchParams = new URLSearchParams(window.location.search);

    if (text) {
        searchParams.set('text', text);
    } else {
        searchParams.delete('text');
    }

    if (type) {
        searchParams.set('type', type);
    } else {
        searchParams.delete('type');
    }

    searchParams.set('sort', sort);

    const newUrl = `${window.location.pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
};
