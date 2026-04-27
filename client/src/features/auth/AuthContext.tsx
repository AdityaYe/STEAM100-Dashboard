import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import api from "../../api/axios";

interface User {
  _id: string;
  username: string;
  email: string;
}

interface LoginPayload {
  user: User;
  token: string;
}

interface AuthContextType {
  user: User | null;
  authLoading: boolean;
  login: (
    data: LoginPayload
  ) => void;
  logout: () => void;
  setUserData: (
    user: User
  ) => void;
}

const TOKEN_KEY =
  "token";

const USER_KEY =
  "user";

const AuthContext =
  createContext<
    AuthContextType | null
  >(null);

const setStoredToken = (
  token: string
) => {
  localStorage.setItem(
    TOKEN_KEY,
    token
  );
};

const setStoredUser = (
  user: User
) => {
  localStorage.setItem(
    USER_KEY,
    JSON.stringify(user)
  );
};

const clearStoredAuth =
  () => {
    localStorage.removeItem(
      TOKEN_KEY
    );
    localStorage.removeItem(
      USER_KEY
    );
  };

const getTokenFromUrl =
  (): string | null => {
    const match =
      window.location.href.match(
        /token=([^&]+)/
      );

    return match?.[1] ?? null;
  };

const removeTokenFromUrl =
  () => {
    window.history.replaceState(
      {},
      document.title,
      "/"
    );
  };

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] =
    useState<User | null>(
      null
    );

  const [
    authLoading,
    setAuthLoading,
  ] = useState(true);

  useEffect(() => {
    const initAuth =
      async () => {
        try {
          const tokenFromUrl =
            getTokenFromUrl();

          if (
            tokenFromUrl
          ) {
            setStoredToken(
              tokenFromUrl
            );
          }

          const token =
            localStorage.getItem(
              TOKEN_KEY
            );

          if (!token) {
            setAuthLoading(false);
            return;
          }

          const res =
            await api.get<
              User
            >(
              "/api/auth/me"
            );

          setUser(
            res.data
          );

          setStoredUser(
            res.data
          );

          if (
            tokenFromUrl
          ) {
            removeTokenFromUrl();
          }
        } catch (err: any) {
          if (err?.response?.status === 401) {
            clearStoredAuth();
            setUser(null);
          }
        } finally {
          setAuthLoading(
            false
          );
        }
      };

    initAuth();
  }, []);

  const setUserData = (
    value: User
  ) => {
    setUser(value);
    setStoredUser(
      value
    );
  };

  const login = ({
  user,
  token,
}: LoginPayload) => {
  setStoredToken(token);
  setStoredUser(user);

  setUser({ ...user });
  setAuthLoading(false);
};

  const logout = () => {
  clearStoredAuth();
  setUser(null);
  setAuthLoading(false);
};

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        login,
        logout,
        setUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth =
  () => {
    const context =
      useContext(
        AuthContext
      );

    if (!context) {
      throw new Error(
        "useAuth must be used within AuthProvider"
      );
    }

    return context;
  };