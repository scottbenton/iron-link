import { onAuthStateChanged } from "firebase/auth";

import { firebaseAuth } from "config/firebase.config";

export interface AuthenticatedUser {
  uid: string;
  displayName: string;
  photoURL?: string;
}

export class AuthService {
  public static listenToAuthState(
    onUserFound: (user: AuthenticatedUser) => void,
    onUserNotFound: () => void,
    onError: (error: Error) => void,
  ): () => void {
    return onAuthStateChanged(
      firebaseAuth,
      (user) => {
        if (user) {
          onUserFound({
            uid: user.uid,
            displayName: user.displayName ?? "Unknown User",
            photoURL: user.photoURL ?? undefined,
          });
        } else {
          onUserNotFound();
        }
      },
      (error) => {
        console.error(error);
        onError(new Error("Failed to listen to auth state"));
      },
    );
  }

  public static getCurrentUserId(): string | null {
    const user = firebaseAuth.currentUser;
    return user ? user.uid : null;
  }
}
