import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole, AuthState } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: Record<string, { password: string; user: User }> = {
  'admin@cropgen.com': {
    password: 'admin123',
    user: {
      id: '1',
      email: 'admin@cropgen.com',
      name: 'Dr. Sarah Chen',
      role: 'admin',
    },
  },
  'researcher@cropgen.com': {
    password: 'user123',
    user: {
      id: '2',
      email: 'researcher@cropgen.com',
      name: 'James Wilson',
      role: 'user',
    },
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const login = useCallback(async (email: string, password: string, role: UserRole): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockUser = mockUsers[email];
    if (mockUser && mockUser.password === password && mockUser.user.role === role) {
      setAuthState({
        user: mockUser.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    }
    
    // Allow demo login with any credentials
    if (email && password) {
      setAuthState({
        user: {
          id: Date.now().toString(),
          email,
          name: role === 'admin' ? 'Admin User' : 'Researcher',
          role,
        },
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    }
    
    setAuthState(prev => ({ ...prev, isLoading: false }));
    return false;
  }, []);

  const logout = useCallback(() => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
