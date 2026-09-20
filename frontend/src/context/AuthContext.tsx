import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id?: number;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore from localStorage on mount
    const savedToken = localStorage.getItem('auth_token');
    const savedEmail = localStorage.getItem('auth_email');
    if (savedToken && savedEmail) {
      setToken(savedToken);
      setUser({ email: savedEmail });
    }
    setLoading(false);
  }, []);

  const login = (email: string, newToken: string) => {
    setToken(newToken);
    setUser({ email });
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('auth_email', email);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_email');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
