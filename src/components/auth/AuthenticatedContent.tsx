import React from 'react';
import { useAuth } from '../../context/useAuth';
import { UserRegistrationModal } from './UserRegistrationModal';

interface AuthenticatedContentProps {
  children: React.ReactNode;
}

export const AuthenticatedContent: React.FC<AuthenticatedContentProps> = ({ children }) => {
  const { isAuthenticated, isNewUser } = useAuth();

  // Show registration modal for new users
  if (isNewUser) {
    return <UserRegistrationModal isOpen={true} />;
  }

  // Block rendering until authenticated
  if (!isAuthenticated) {
    return (
      <div className="loading-container">
        <p>Checking authentication status...</p>
      </div>
    );
  }

  // User is authenticated, render children
  return <>{children}</>;
};
