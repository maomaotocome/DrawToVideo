import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  // Mock authentication check
  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      // For now, simulate unauthenticated user
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const login = async () => {
    // Mock Google login
    console.log("Redirecting to Google OAuth...");
    
    // Simulate successful login after redirect
    const mockUser: User = {
      id: "user_123",
      email: "user@example.com",
      name: "Creative User",
      profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
    };

    setAuthState({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false
    });
  };

  const logout = async () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  return {
    ...authState,
    login,
    logout
  };
}