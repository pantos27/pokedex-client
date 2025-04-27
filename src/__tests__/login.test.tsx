import {describe, it, expect, vi, beforeEach} from 'vitest';
import {renderHook} from './test-utils';
import {useUserRegistration} from '../hooks/useUserRegistration';
import {useAuth} from '../context/useAuth';
import * as userApi from '../api/userApi';
import {act} from "@testing-library/react";

// Mock the userApi module
vi.mock('../api/userApi', () => ({
    useUserApi: vi.fn(() => ({
        registerUser: vi.fn(),
        isRegistering: false,
    })),
    useGetUserById: vi.fn(() => ({
        data: null,
        error: null,
        isError: false,
    })),
}));

// Mock the auth context
vi.mock('../context/useAuth', () => {
    const createContext = vi.fn();
    const AuthContext = {Provider: ({children}: { children: unknown }) => children};

    // Create a mock implementation of useAuth
    const mockUser = {id: '', username: '', capturedPokemon: []};
    let isAuthenticated = false;
    const mockSetUser = vi.fn((user) => {
        mockUser.id = user.id;
        mockUser.username = user.username;
        mockUser.capturedPokemon = user.capturedPokemon;
        isAuthenticated = true;
    });

    return {
        useAuth: vi.fn(() => ({
            user: isAuthenticated ? mockUser : null,
            isAuthenticated,
            isNewUser: false,
            setUser: mockSetUser,
            setIsNewUser: vi.fn(),
            logout: vi.fn(),
        })),
        AuthContext,
        createContext,
    };
});

describe('Login Flow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should update username when handleUsernameChange is called', () => {
        const {result} = renderHook(() => useUserRegistration());

        act(() => {
            result.current.handleUsernameChange('testuser');
        });

        expect(result.current.username).toBe('testuser');
    });

    it('should show error when registering with empty username', async () => {
        const {result} = renderHook(() => useUserRegistration());

        await act(async () => {
            await result.current.registerUser();
        });

        expect(result.current.error).toBe('Username is required');
    });

    it('should register user successfully and update auth context', async () => {
        // Mock successful registration
        const mockRegisterUser = vi.fn().mockResolvedValue({
            id: 'user-123',
            user_name: 'testuser',
            captured_pokemon: []
        });

        vi.mocked(userApi.useUserApi).mockReturnValue({
            registerUser: mockRegisterUser,
            isRegistering: false,
        });

        // Instead of testing the interaction between separate hooks,
        // we'll test that useUserRegistration calls setUser correctly
        const {result} = renderHook(() => useUserRegistration());

        // Set username and register
        act(() => {
            result.current.handleUsernameChange('testuser');
        });

        await act(async () => {
            await result.current.registerUser();
        });

        // Verify API was called with correct parameters
        expect(mockRegisterUser).toHaveBeenCalledWith({user_name: 'testuser'});

        // Get the mock function from the useAuth mock
        const mockSetUser = vi.mocked(useAuth().setUser);

        // Verify setUser was called with the correct user data
        expect(mockSetUser).toHaveBeenCalledWith({
            id: 'user-123',
            username: 'testuser',
            capturedPokemon: []
        });
    });

    it('should handle registration error', async () => {
        // Mock failed registration
        const mockError = new Error('Registration failed');
        const mockRegisterUser = vi.fn().mockRejectedValue(mockError);

        vi.mocked(userApi.useUserApi).mockReturnValue({
            registerUser: mockRegisterUser,
            isRegistering: false,
        });

        const {result} = renderHook(() => useUserRegistration());

        // Set username
        act(() => {
            result.current.handleUsernameChange('testuser');
        });

        // Try to register and expect it to fail
        await act(async () => {
            // We expect this to throw but we're testing the error state, not the throw itself
            await result.current.registerUser().catch(() => {
                // Catch error to prevent test failure
            });
        });

        // Verify error state
        expect(result.current.error).toBe('Registration failed');
    });
});
