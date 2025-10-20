import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from './api';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateBalance: (newBalance: number) => void;
  updatePremium: (premiumUntil: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateBalance = (newBalance: number) => {
    if (user) {
      const updated = { ...user, insectomix_balance: newBalance };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
    }
  };

  const updatePremium = (premiumUntil: string) => {
    if (user) {
      const updated = { ...user, is_premium: true, premium_until: premiumUntil };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateBalance, updatePremium }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
