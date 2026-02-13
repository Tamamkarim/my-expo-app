import React, {createContext, useContext, useState, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchData} from '../utils/fetch-data';
import type {AuthUser} from '../types/DBTypes';

export interface Credentials {
  username: string;
  password: string;
}

export interface RegisterInputs extends Credentials {
  email: string;
  confirmPassword?: string;
}

export interface UserContextState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  handleLogin: (credentials: Credentials) => Promise<void>;
  handleLogout: () => Promise<void>;
  handleAutoLogin: () => Promise<void>;
}

const UserContext = createContext<UserContextState | undefined>(undefined);

const TOKEN_KEY = 'my-app-token';

interface Props {
  children: React.ReactNode;
}

export const UserProvider = ({children}: Props) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = useCallback(async (credentials: Credentials) => {
    try {
      setLoading(true);
      setError(null);
      const loginResult = await fetchData<{token: string}>(
        `${process.env.EXPO_PUBLIC_AUTH_API as string}/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        },
      );

      const newToken = loginResult.token;
      setToken(newToken);
      await AsyncStorage.setItem(TOKEN_KEY, newToken);

      const me = await fetchData<AuthUser>(
        `${process.env.EXPO_PUBLIC_AUTH_API as string}/users/user`,
        {
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
        },
      );
      setUser(me);
    } catch (error) {
      console.error('Login failed', error);
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      setUser(null);
      setToken(null);
      setError(null);
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Logout failed', error);
    }
  }, []);

  const handleAutoLogin = useCallback(async () => {
    try {
      setLoading(true);
      const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
      if (!storedToken) return;

      const me = await fetchData<AuthUser>(
        `${process.env.EXPO_PUBLIC_AUTH_API as string}/users/user`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        },
      );
      setToken(storedToken);
      setUser(me);
    } catch (error) {
      console.error('Auto login failed', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{user, token, loading, error, handleLogin, handleLogout, handleAutoLogin}}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextState => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUserContext must be used within UserProvider');
  }
  return ctx;
};
