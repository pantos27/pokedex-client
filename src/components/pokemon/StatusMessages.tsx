import { ReactNode } from 'react';

interface StatusMessagesProps {
  status: 'pending' | 'error' | 'success';
  isEmpty: boolean;
}

const StatusMessages = ({ status, isEmpty }: StatusMessagesProps) => {
  let content: ReactNode = null;

  if (status === 'pending') {
    content = <div className="loading">Loading Pokémon data...</div>;
  } else if (status === 'error') {
    content = <div className="error">Error loading Pokémon data</div>;
  } else if (isEmpty) {
    content = <div className="empty">No pokemons found</div>;
  }

  return content;
};

export default StatusMessages;
