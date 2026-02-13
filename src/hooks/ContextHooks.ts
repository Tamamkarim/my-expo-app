import {useContext} from 'react';
import {UpdateContext, type UpdateContextType} from '../contexts/UpdateContext';
export {useUserContext} from '../contexts/UserContext';

export const useUpdateContext = (): UpdateContextType => {
  const ctx = useContext(UpdateContext);
  if (!ctx) {
    throw new Error('useUpdateContext must be used within an UpdateProvider');
  }
  return ctx;
};
