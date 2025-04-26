import React, { useState, useEffect, ReactNode } from 'react';
import { AuthContext, User } from './useAuth';
import { setCookie, getCookie, removeCookie } from '../utils/cookieUtils';
import { useGetUserById } from '../api/userApi';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Check for existing user ID in cookies on mount
  useEffect(() => {
    const storedUserId = getCookie('user_id');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setIsNewUser(true);
    }
  }, []);

  // Fetch user data when userId is available
  const { data: userData, error, isError } = useGetUserById(userId);

  useEffect(() => {
    if (userData) {
      const userWithName: User = {
        id: userData.id,
        username: userData.user_name
      };
      setUserState(userWithName);
      setCookie('user_name', userData.user_name);
      setIsNewUser(false);
    }
  }, [userData]);

  // Handle 404 error - user not found
  useEffect(() => {
    if (isError && error instanceof Error) {
      console.error('Error fetching user:', error);
      // If user not found, clear user state and cookies
      logout();
    }
  }, [isError, error]);

  const setUser = (newUser: User): void => {
    setUserState(newUser);
    setCookie('user_id', newUser.id);
    setCookie('user_name', newUser.username);
    setUserId(newUser.id);
    setIsNewUser(false);
  };

  const logout = (): void => {
    setUserState(null);
    setUserId(null);
    removeCookie('user_id');
    removeCookie('user_name');
    setIsNewUser(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isNewUser,
        setUser,
        setIsNewUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
