import {useContext} from 'react';
import {UserContext, UserContextState} from '../contexts/UserContext';

export const useUserContext = (): UserContextState => {
  const ctx = useContext(UserContext as React.Context<UserContextState | undefined>);
  if (!ctx) {
    throw new Error('useUserContext must be used within UserProvider');
  }
  return ctx;
};
