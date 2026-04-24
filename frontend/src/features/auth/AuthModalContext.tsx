import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import LoginModal from "./LoginModal";

export type AuthMode =
  | "login"
  | "register";

interface AuthModalContextType {
  open: boolean;
  mode: AuthMode;

  setOpen: (
    value: boolean
  ) => void;

  setMode: (
    mode: AuthMode
  ) => void;

  openLogin: () => void;
  openRegister: () => void;
  closeModal: () => void;
}

const AuthModalContext =
  createContext<
    AuthModalContextType | null
  >(null);

export const AuthModalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [open, setOpen] =
    useState(false);

  const [mode, setMode] =
    useState<AuthMode>(
      "login"
    );

  const closeModal =
    () => {
      setOpen(false);
    };

  const openLogin =
    () => {
      setMode("login");
      setOpen(true);
    };

  const openRegister =
    () => {
      setMode(
        "register"
      );
      setOpen(true);
    };

  return (
    <AuthModalContext.Provider
      value={{
        open,
        mode,
        setOpen,
        setMode,
        openLogin,
        openRegister,
        closeModal,
      }}
    >
      {children}

      <LoginModal
        isOpen={open}
        onClose={
          closeModal
        }
      />
    </AuthModalContext.Provider>
  );
};

export const useAuthModal =
  () => {
    const context =
      useContext(
        AuthModalContext
      );

    if (!context) {
      throw new Error(
        "useAuthModal must be used within AuthModalProvider"
      );
    }

    return context;
  };
