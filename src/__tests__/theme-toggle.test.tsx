import {describe, it, expect, vi, beforeEach} from 'vitest';
import {render} from './test-utils';
import ThemeToggle from '../components/ThemeToggle';
import {ThemeProvider} from '../context/ThemeContext';
import {useTheme} from '../context/useTheme';
import {fireEvent, screen} from "@testing-library/react";

// Create a test component that uses the theme context
const TestComponent = () => {
    const {theme} = useTheme();
    return (
        <div data-testid="theme-value">
            Current theme: {theme}
        </div>
    );
};

describe('Theme Toggle', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Reset the document's data-theme attribute
        document.documentElement.removeAttribute('data-theme');

        // Mock matchMedia to control the initial theme
        window.matchMedia = vi.fn().mockImplementation(query => ({
            matches: false, // Default to light mode
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        }));
    });

    it('should render the theme toggle button', () => {
        render(<ThemeToggle/>);

        const toggleButton = screen.getByRole('button');
        expect(toggleButton).toBeInTheDocument();
    });

    it('should toggle theme when clicked', () => {
        render(
            <ThemeProvider>
                <TestComponent/>
                <ThemeToggle/>
            </ThemeProvider>
        );

        // Initial theme should be light
        expect(screen.getByTestId('theme-value').textContent).toContain('light');

        // Click the toggle button
        const toggleButton = screen.getByRole('button');
        fireEvent.click(toggleButton);

        // Theme should now be dark
        expect(screen.getByTestId('theme-value').textContent).toContain('dark');

        // Click again
        fireEvent.click(toggleButton);

        // Theme should be back to light
        expect(screen.getByTestId('theme-value').textContent).toContain('light');
    });

    it('should update document data-theme attribute', () => {
        render(
            <ThemeProvider>
                <ThemeToggle/>
            </ThemeProvider>
        );

        // Initial theme should be light
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');

        // Click the toggle button
        const toggleButton = screen.getByRole('button');
        fireEvent.click(toggleButton);

        // Document attribute should be updated to dark
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('should show sun icon in light mode and moon icon in dark mode', () => {
        render(
            <ThemeProvider>
                <ThemeToggle/>
            </ThemeProvider>
        );

        // In light mode, should show sun icon
        expect(screen.getByTitle(/switch to dark mode/i)).toBeInTheDocument();

        // Click to switch to dark mode
        const toggleButton = screen.getByRole('button');
        fireEvent.click(toggleButton);

        // In dark mode, should show moon icon
        expect(screen.getByTitle(/switch to light mode/i)).toBeInTheDocument();
    });

    it('should initialize with dark theme when user prefers dark mode', () => {
        // Mock matchMedia to simulate user preference for dark mode
        window.matchMedia = vi.fn().mockImplementation(query => ({
            matches: query === '(prefers-color-scheme: dark)',
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        }));

        render(
            <ThemeProvider>
                <TestComponent/>
            </ThemeProvider>
        );

        // Initial theme should be dark
        expect(screen.getByTestId('theme-value').textContent).toContain('dark');
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
});
