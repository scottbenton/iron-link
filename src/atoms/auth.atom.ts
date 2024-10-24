import { firebaseAuth } from "config/firebase.config";
import { onAuthStateChanged, User } from "firebase/auth";
import { atom, useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";

import { UserDocument } from "api-calls/user/_user.type";
import { updateUserDoc } from "api-calls/user/updateUserDoc";
import { derivedAtomWithEquality } from "atoms/derivedAtomWithEquality";

export enum AuthState {
  Loading,
  Unauthenticated,
  Authenticated,
}

export const authAtom = atom<{
  user?: User;
  uid: string;
  status: AuthState;
  userDoc?: UserDocument;
}>({
  uid: "",
  status: AuthState.Loading,
});

export function useAuthAtom() {
  return useAtom(authAtom);
}

export function useUID() {
  return useAtomValue(authAtom).uid;
}

export function useListenToAuth() {
  const [, setAuth] = useAuthAtom();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      (user) => {
        if (user) {
          const userDoc: UserDocument = {
            displayName: user.displayName ?? "Unknown User",
          };

          if (user.photoURL) {
            userDoc.photoURL = user.photoURL;
          }

          updateUserDoc({ uid: user.uid, user: userDoc }).catch((e) => {
            console.error(e);
          });

          setAuth({
            user: user ?? undefined,
            uid: user?.uid ?? "",
            status: AuthState.Authenticated,
            userDoc,
          });
        } else {
          setAuth({
            user: undefined,
            uid: "",
            status: AuthState.Unauthenticated,
          });
        }
      },
      (error) => {
        console.error(error);
        setAuth({
          user: undefined,
          uid: "",
          status: AuthState.Unauthenticated,
        });
      },
    );
    return unsubscribe;
  }, [setAuth]);
}

const authStatusAtom = derivedAtomWithEquality(authAtom, (atom) => atom.status);
export function useAuthStatus() {
  return useAtomValue(authStatusAtom);
}

export function useCurrentUserUID() {
  return useAtomValue(authAtom).uid;
}
