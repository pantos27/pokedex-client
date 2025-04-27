import {describe, it, expect, vi, beforeEach} from 'vitest';
import {renderHook} from './test-utils';
import {usePokemonCapture} from '../hooks/usePokemonCapture';
import * as captureApi from '../api/useCaptureApi';
import * as authContext from '../context/useAuth';
import {mockUser} from './test-utils';
import {act} from "@testing-library/react";

// Mock the capture API
vi.mock('../api/useCaptureApi', () => ({
    useCapturePokemonApi: vi.fn(),
}));

// Mock the auth context
vi.mock('../context/useAuth', () => {
    const createContext = vi.fn();
    const AuthContext = {Provider: ({children}: { children: unknown }) => children};
    return {
        useAuth: vi.fn(),
        AuthContext,
        createContext,
    };
});

describe('Pokemon Capture', () => {
    const mockCapturePokemon = vi.fn();
    const mockSetUser = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        // Default API mock implementation
        vi.mocked(captureApi.useCapturePokemonApi).mockReturnValue({
            capturePokemon: mockCapturePokemon,
            isCapturing: false,
            captureError: null,
            captureReset: function (): void {
                throw new Error('Function not implemented.');
            }
        });

        // Default auth context mock implementation
        vi.mocked(authContext.useAuth).mockReturnValue({
            user: {...mockUser},
            isAuthenticated: true,
            isNewUser: false,
            setUser: mockSetUser,
            setIsNewUser: vi.fn(),
            logout: vi.fn(),
        });
    });

    it('should initialize with idle status for uncaptured Pokemon', () => {
        const {result} = renderHook(() => usePokemonCapture(10)); // Pokemon ID not in user's captured list

        expect(result.current.captureStatus).toBe('idle');
        expect(result.current.isCapturing).toBe(false);
    });

    it('should initialize with success status for already captured Pokemon', () => {
        const {result} = renderHook(() => usePokemonCapture(1)); // Pokemon ID 1 is in mockUser's captured list

        expect(result.current.captureStatus).toBe('success');
    });

    it('should capture a Pokemon successfully', async () => {
        // Mock successful capture
        const captureResponse = {pokemon_id: 10, date_created: new Date('2023-01-03T00:00:00Z')};
        mockCapturePokemon.mockResolvedValue(captureResponse);

        const {result} = renderHook(() => usePokemonCapture(10));

        // Initial state
        expect(result.current.captureStatus).toBe('idle');

        // Capture the Pokemon
        await act(async () => {
            await result.current.handleCapture();
        });

        // Verify API was called with correct parameters
        expect(mockCapturePokemon).toHaveBeenCalledWith({pokemon_id: 10});

        // Verify status was updated
        expect(result.current.captureStatus).toBe('success');

        // Verify user was updated with the new captured Pokemon
        expect(mockSetUser).toHaveBeenCalled();
        const updatedUser = mockSetUser.mock.calls[0][0];
        expect(updatedUser.capturedPokemon).toContainEqual(captureResponse);
    });

    it('should handle capture error', async () => {
        // Mock failed capture
        mockCapturePokemon.mockRejectedValue(new Error('Capture failed'));

        // Mock setTimeout to execute immediately
        vi.useFakeTimers();

        const {result} = renderHook(() => usePokemonCapture(10));

        // Capture the Pokemon
        await act(async () => {
            const capturePromise = result.current.handleCapture();
            await capturePromise.catch(() => {
                // Catch error to prevent test failure
            });
        });

        // Verify status was updated to error
        expect(result.current.captureStatus).toBe('error');

        // Fast-forward timer to test reset to idle
        act(() => {
            vi.advanceTimersByTime(3000);
        });

        // Verify status was reset to idle
        expect(result.current.captureStatus).toBe('idle');

        vi.useRealTimers();
    });

    it('should update status when user captures a Pokemon', async () => {
        // Start with user who hasn't captured Pokemon with ID 10
        vi.mocked(authContext.useAuth).mockReturnValue({
            user: {...mockUser},
            isAuthenticated: true,
            isNewUser: false,
            setUser: mockSetUser,
            setIsNewUser: vi.fn(),
            logout: vi.fn(),
        });

        const {result, rerender} = renderHook(() => usePokemonCapture(10));

        // Initial status should be idle
        expect(result.current.captureStatus).toBe('idle');

        // Update user to include the captured Pokemon
        const updatedUser = {
            ...mockUser,
            capturedPokemon: [
                ...mockUser.capturedPokemon,
                {pokemon_id: 10, date_created: new Date('2023-01-03T00:00:00Z')}
            ]
        };

        vi.mocked(authContext.useAuth).mockReturnValue({
            user: updatedUser,
            isAuthenticated: true,
            isNewUser: false,
            setUser: mockSetUser,
            setIsNewUser: vi.fn(),
            logout: vi.fn(),
        });

        // Rerender the hook
        rerender();

        // Status should now be success
        expect(result.current.captureStatus).toBe('success');
    });
});
