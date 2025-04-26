import React from 'react';
import { useUserRegistration } from '../../hooks/useUserRegistration';
import './UserRegistrationModal.css';

interface UserRegistrationModalProps {
  isOpen: boolean;
}

export const UserRegistrationModal: React.FC<UserRegistrationModalProps> = ({ isOpen }) => {
  const {
    username,
    error,
    isSubmitting,
    handleUsernameChange,
    registerUser
  } = useUserRegistration();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser();
    } catch {
      // Error is handled in the hook
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Welcome to Pokemon Explorer!</h2>
        <p>Please enter your username to continue:</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              placeholder="Enter your username"
              disabled={isSubmitting}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};
