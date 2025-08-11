'use client';

import { useReducer, useMemo, useCallback } from 'react';

import { AuthContext } from './auth-context';
import { setSession } from './utils';
import { AuthUserType, AuthStateType, ActionMapType } from '../../types';
import axios, { endpoints } from '@/utils/axios';

// ----------------------------------------------------------------------

enum Types {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.LOGIN]: { user: AuthUserType };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

const initialState: AuthStateType = {
  user: null,
  loading: false,
};

const reducer = (state: AuthStateType, action: ActionsType): AuthStateType => {
  switch (action.type) {
    case Types.LOGIN:
      return { ...state, user: action.payload.user };
    case Types.LOGOUT:
      return { ...state, user: null };
    default:
      return state;
  }
};

const STORAGE_KEY = 'accessToken';

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = useCallback(async (email: string, password: string) => {
    const res = await axios.post(endpoints.auth.login, { email, password });

    const { accessToken, user } = res.data;

    setSession(accessToken); // Set Axios headers + sessionStorage
    sessionStorage.setItem(STORAGE_KEY, accessToken);

    dispatch({
      type: Types.LOGIN,
      payload: {
        user: {
          ...user,
          accessToken,
        },
      },
    });
  }, []);

  const logout = useCallback(async () => {
    setSession(null);
    sessionStorage.removeItem(STORAGE_KEY);

    dispatch({ type: Types.LOGOUT });
  }, []);

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: false,
      authenticated: !!state.user,
      unauthenticated: !state.user,
      login,
      logout,
    }),
    [state.user, login, logout]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
