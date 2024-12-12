import deepEqual from "fast-deep-equal";
import { useEffect } from "react";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { AuthService } from "services/auth.service";
import { UserService } from "services/user.service";

export enum AuthStatus {
  Loading,
  Unauthenticated,
  Authenticated,
}

interface AuthState {
  status: AuthStatus;
  user:
    | {
        uid: string;
        displayName: string;
      }
    | undefined;
}
interface AuthActions {
  subscribeToAuthStatus: () => () => void;
}

export const useAuthStore = createWithEqualityFn<AuthState & AuthActions>()(
  immer((set) => ({
    status: AuthStatus.Loading,
    user: undefined,

    subscribeToAuthStatus: () => {
      return AuthService.listenToAuthState(
        (user) => {
          set((state) => {
            state.status = AuthStatus.Authenticated;
            state.user = {
              uid: user.uid,
              displayName: user.displayName,
            };
          });
          UserService.setUserNameAndPhoto(
            user.uid,
            user.displayName,
            user.photoURL,
          );
        },
        () => {
          set((state) => {
            state.status = AuthStatus.Unauthenticated;
            state.user = undefined;
          });
        },
        () => {
          set((state) => {
            state.status = AuthStatus.Unauthenticated;
            state.user = undefined;
          });
        },
      );
    },
  })),
  deepEqual,
);

export function useUID() {
  return useAuthStore((state) => state.user?.uid);
}

export function useAuthStatus() {
  return useAuthStore((state) => state.status);
}

export function useListenToAuth() {
  const subscribeToAuthStatus = useAuthStore(
    (store) => store.subscribeToAuthStatus,
  );

  useEffect(() => {
    console.debug("Subscribing to auth status");
    const unsubscribe = subscribeToAuthStatus();
    return unsubscribe;
  }, [subscribeToAuthStatus]);
}
