import React from 'react';
import '../styles/ThemeToggle.css';
import moonIcon from '../assets/moon.svg';
import sunIcon from '../assets/sun.svg';
import {useTheme} from "../context/useTheme.ts";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle">
      <button
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        className="theme-toggle-button"
      >
        {theme === 'light' ? (
          // Moon icon for dark mode
          <img src={moonIcon} alt="Moon icon" />
        ) : (
          // Sun icon for light mode
          <img src={sunIcon} alt="Sun icon" />
        )}
      </button>
    </div>
  );
};

export default ThemeToggle;
