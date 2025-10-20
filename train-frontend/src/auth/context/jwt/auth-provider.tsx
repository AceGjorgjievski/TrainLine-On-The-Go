'use client';

import { useReducer, useMemo, useCallback, useEffect } from 'react';

import { AuthContext } from './auth-context';
import { isValidToken, setSession } from './utils';
import { AuthUserType, AuthStateType, ActionMapType } from '../../types';
import axiosInstance, { endpoints } from '@/utils/axios';

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
  loading: true,
};

const reducer = (state: AuthStateType, action: ActionsType): AuthStateType => {
  switch (action.type) {
    case Types.LOGIN:
      return { ...state, user: action.payload.user, loading: false };
    case Types.LOGOUT:
      return { ...state, user: null, loading: false };
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

  const login = useCallback(async (username: string, password: string) => {
    const res = await axiosInstance.post(endpoints.auth.login, { username, password });

    const { accessToken, user } = res.data;

    setSession(accessToken);
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

  useEffect(() => {
    const token = sessionStorage.getItem(STORAGE_KEY);
    if (token && isValidToken(token)) {
      setSession(token);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoded: any = JSON.parse(atob(token.split('.')[1]));
      const user = { id: decoded.sub, accessToken: token };
      dispatch({ type: Types.LOGIN, payload: { user } });
    } else {
      dispatch({ type: Types.LOGOUT });
    }
  }, []);

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: state.loading,
      authenticated: !!state.user,
      unauthenticated: !state.user,
      login,
      logout,
    }),
    [state.user, state.loading, login, logout]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
