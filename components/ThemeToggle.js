import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: 'var(--glass)',
        border: '1px solid var(--border)',
        color: 'var(--teal)',
        width: '40px',
        height: '40px',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
      }}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'var(--teal-glow)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.borderColor = 'rgba(0, 201, 177, 0.4)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'var(--glass)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      <div style={{
        transform: theme === 'dark' ? 'translateY(0)' : 'translateY(40px)',
        transition: 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        position: 'absolute',
      }}>
        🌙
      </div>
      <div style={{
        transform: theme === 'dark' ? 'translateY(-40px)' : 'translateY(0)',
        transition: 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        position: 'absolute',
      }}>
        ☀️
      </div>
    </button>
  );
}
