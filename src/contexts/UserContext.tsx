import React, {createContext, useContext, useState, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchData} from '../utils/fetch-data';

export interface Credentials {
  username: string;
  password: string;
}

export interface RegisterInputs extends Credentials {
  email: string;
  confirmPassword?: string;
}

export interface UserContextState {
  user: unknown | null;
  token: string | null;
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
  const [user, setUser] = useState<unknown | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const handleLogin = useCallback(async (credentials: Credentials) => {
    try {
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

      const me = await fetchData<unknown>(
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
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Logout failed', error);
    }
  }, []);

  const handleAutoLogin = useCallback(async () => {
    try {
      const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
      if (!storedToken) return;

      const me = await fetchData<unknown>(
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
    }
  }, []);

  return (
    <UserContext.Provider
      value={{user, token, handleLogin, handleLogout, handleAutoLogin}}
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
