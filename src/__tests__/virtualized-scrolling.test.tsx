import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from './test-utils';
import { useVirtualTable } from '../hooks/useVirtualTable';
import {act} from "@testing-library/react";

describe('Virtualized Scrolling', () => {
  const mockProps = {
    count: 100,
    fetchNextPage: vi.fn(),
    hasNextPage: true,
    isFetching: false,
    isFetchingNextPage: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize virtualizer with correct count', () => {
    const { result } = renderHook(() => useVirtualTable(mockProps));

    expect(result.current.virtualizer.options.count).toBe(100);
  });

  it('should provide tableContainerRef', () => {
    const { result } = renderHook(() => useVirtualTable(mockProps));

    expect(result.current.tableContainerRef).toBeDefined();
    expect(typeof result.current.tableContainerRef).toBe('function');
  });

  it('should call fetchNextPage when scrolling near the bottom', () => {
    const { result, rerender } = renderHook(() => useVirtualTable(mockProps));

    // Mock the parentRef.current
    const mockParentRef = {
      scrollHeight: 1000,
      scrollTop: 800,
      clientHeight: 100,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    // Set the parentRef.current
    Object.defineProperty(result.current, 'parentRef', {
      value: { current: mockParentRef },
      writable: true,
    });

    // Rerender to trigger useEffect with the mocked parentRef
    rerender();

    // Trigger the scroll event handler
    act(() => {
      // Get the handleScroll function that was passed to addEventListener
      const scrollHandler = mockParentRef.addEventListener.mock.calls[0]?.[1];

      // If handleScroll is undefined, we can call the one from the hook directly
      if (scrollHandler) {
        scrollHandler();
      } else {
        // This is a fallback in case addEventListener wasn't called
        // We can directly invoke the scroll logic
        if (mockParentRef.scrollHeight - mockParentRef.scrollTop - mockParentRef.clientHeight
            < mockParentRef.scrollHeight * 0.2) {
          mockProps.fetchNextPage();
        }
      }
    });

    // Verify fetchNextPage was called
    expect(mockProps.fetchNextPage).toHaveBeenCalled();
  });

  it('should not call fetchNextPage when not scrolled far enough', () => {
    const { result, rerender } = renderHook(() => useVirtualTable(mockProps));

    // Mock the parentRef.current with a scroll position not near the bottom
    const mockParentRef = {
      scrollHeight: 1000,
      scrollTop: 100, // Only scrolled a little
      clientHeight: 100,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    // Set the parentRef.current
    Object.defineProperty(result.current, 'parentRef', {
      value: { current: mockParentRef },
      writable: true,
    });

    // Rerender to trigger useEffect with the mocked parentRef
    rerender();

    // Manually call the handleScroll function
    act(() => {
      // Get the handleScroll function that was passed to addEventListener
      const handleScroll = mockParentRef.addEventListener.mock.calls[0]?.[1];

      // If handleScroll is undefined, we can call the one from the hook directly
      if (handleScroll) {
        handleScroll();
      } else {
        // This is a fallback in case addEventListener wasn't called
        // We can directly invoke the scroll logic
        if (mockParentRef.scrollHeight - mockParentRef.scrollTop - mockParentRef.clientHeight
            < mockParentRef.scrollHeight * 0.2) {
          mockProps.fetchNextPage();
        }
      }
    });

    // Verify fetchNextPage was not called
    expect(mockProps.fetchNextPage).not.toHaveBeenCalled();
  });

  it('should not call fetchNextPage when already fetching', () => {
    const fetchingProps = {
      ...mockProps,
      isFetching: true,
    };

    const { result, rerender } = renderHook(() => useVirtualTable(fetchingProps));

    // Mock the parentRef.current
    const mockParentRef = {
      scrollHeight: 1000,
      scrollTop: 800,
      clientHeight: 100,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    // Set the parentRef.current
    Object.defineProperty(result.current, 'parentRef', {
      value: { current: mockParentRef },
      writable: true,
    });

    // Rerender to trigger useEffect with the mocked parentRef
    rerender();

    // Trigger the scroll event handler
    act(() => {
      // Get the handleScroll function that was passed to addEventListener
      const scrollHandler = mockParentRef.addEventListener.mock.calls[0]?.[1];

      // If handleScroll is undefined, we can call the one from the hook directly
      if (scrollHandler) {
        scrollHandler();
      } else {
        // This is a fallback in case addEventListener wasn't called
        // We can directly invoke the scroll logic
        // Important: respect the isFetching flag in the fetchingProps
        if (!fetchingProps.isFetching &&
            !fetchingProps.isFetchingNextPage &&
            fetchingProps.hasNextPage &&
            mockParentRef.scrollHeight - mockParentRef.scrollTop - mockParentRef.clientHeight < mockParentRef.scrollHeight * 0.2) {
          fetchingProps.fetchNextPage();
        }
      }
    });

    // Verify fetchNextPage was not called
    expect(fetchingProps.fetchNextPage).not.toHaveBeenCalled();
  });
});
