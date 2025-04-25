import { useCallback, useEffect, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

interface UseVirtualTableProps {
    count: number;
    fetchNextPage: () => void;
    hasNextPage: boolean | undefined;
    isFetching: boolean;
    isFetchingNextPage: boolean;
}

export const useVirtualTable = ({
    count,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
}: UseVirtualTableProps) => {
    const parentRef = useMemo(() => ({ current: null as HTMLDivElement | null }), []);

    const tableContainerRef = useCallback((node: HTMLDivElement | null) => {
        if (node) parentRef.current = node;
    }, [parentRef]);

    const virtualizer = useVirtualizer({
        count,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 50,
        overscan: 10,
    });

    const handleScroll = useCallback(() => {
        if (!parentRef.current) return;

        const { scrollHeight, scrollTop, clientHeight } = parentRef.current;

        // When the user scrolls to 80% of the way down, fetch more data
        if (
            !isFetching &&
            !isFetchingNextPage &&
            hasNextPage &&
            scrollHeight - scrollTop - clientHeight < scrollHeight * 0.2
        ) {
            fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, parentRef]);

    useEffect(() => {
        const scrollElement = parentRef.current;
        if (scrollElement) {
            scrollElement.addEventListener('scroll', handleScroll);
            return () => scrollElement.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll, parentRef]);

    return {
        tableContainerRef,
        virtualizer,
        parentRef,
    };
};
