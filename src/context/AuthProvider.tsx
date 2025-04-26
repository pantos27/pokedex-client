import React, { useState, useEffect, ReactNode } from 'react';
import { AuthContext, User } from './useAuth';
import { setCookie, getCookie, removeCookie } from '../utils/cookieUtils';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);

  // Check for existing user ID in cookies on mount
  useEffect(() => {
    const userId = getCookie('user_id');
    if (userId) {
      setUserState({ id: userId, username: '' });
    } else {
      setIsNewUser(true);
    }
  }, []);

  const setUser = (newUser: User): void => {
    setUserState(newUser);
    setCookie('user_id', newUser.id);
    setIsNewUser(false);
  };

  const logout = (): void => {
    setUserState(null);
    removeCookie('user_id');
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
