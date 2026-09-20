import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

type Theme = 'light' | 'dark' | 'system';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'system';
  });
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('currency') || 'INR';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = document.documentElement;
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="settings-page">
      <PageHeader title="Settings" subtitle="Manage your account and preferences" />

      {/* Account */}
      <section className="settings-section">
        <h2>Account</h2>
        <div className="settings-card">
          <div className="settings-row">
            <span className="settings-label">Email</span>
            <span className="settings-value">{user?.email || 'user@example.com'}</span>
          </div>
        </div>
      </section>

      {/* Preferences */}
      <section className="settings-section">
        <h2>Preferences</h2>
        <div className="settings-card">
          <div className="settings-row">
            <span className="settings-label">Currency</span>
            <select
              className="settings-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="INR">₹ INR</option>
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
              <option value="GBP">£ GBP</option>
            </select>
          </div>
          <div className="settings-divider" />
          <div className="settings-row">
            <span className="settings-label">Theme</span>
            <div className="theme-switcher">
              <button
                className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
                aria-label="Light theme"
              >
                <Sun size={16} /> Light
              </button>
              <button
                className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
                aria-label="Dark theme"
              >
                <Moon size={16} /> Dark
              </button>
              <button
                className={`theme-btn ${theme === 'system' ? 'active' : ''}`}
                onClick={() => setTheme('system')}
                aria-label="System theme"
              >
                <Monitor size={16} /> System
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="settings-section">
        <h2>Danger Zone</h2>
        <div className="settings-card danger-zone">
          <div className="settings-row">
            <div>
              <span className="settings-label">Log out</span>
              <p className="settings-description">End your current session</p>
            </div>
            <Button variant="secondary" onClick={handleLogout}>Log out</Button>
          </div>
        </div>
      </section>
    </div>
  );
};
