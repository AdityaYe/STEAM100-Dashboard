import { useCallback } from "react";

import { useAuth } from "../features/auth/AuthContext";
import { useAuthModal } from "../features/auth/AuthModalContext";

export const useProtectedAction =
  () => {
    const { user } =
      useAuth();

    const {
      openLogin,
    } =
      useAuthModal();

    const runProtected =
      useCallback(
        (
          action: () => void
        ) => {
          if (!user) {
            openLogin();
            return;
          }

          action();
        },
        [user, openLogin]
      );

    return {
      user,
      runProtected,
      isAuthenticated:
        !!user,
    };
  };