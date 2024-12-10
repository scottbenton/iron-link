import {
  DocumentReference,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

import { firestore } from "config/firebase.config";

import {
  NotFoundError,
  StorageError,
  convertUnknownErrorToStorageError,
} from "./errors/storageErrors";

export interface UserDTO {
  displayName: string;
  photoURL: string | null;
  hidePhoto: boolean | null;
  appVersion: string | null;
}

export class UserRepository {
  private static collectionName = "users";

  private static getDocRef(userId: string): DocumentReference<UserDTO> {
    return doc(
      firestore,
      `${this.collectionName}/${userId}`,
    ) as DocumentReference<UserDTO>;
  }

  public static async getUser(userId: string): Promise<UserDTO> {
    return new Promise<UserDTO>((res, reject) => {
      getDoc(this.getDocRef(userId))
        .then((doc) => {
          if (doc.exists()) {
            res(doc.data() as UserDTO);
          } else {
            reject(
              new NotFoundError(`User with id ${userId} could not be found`),
            );
          }
        })
        .catch((err) => {
          reject(convertUnknownErrorToStorageError(err, "Failed to get user"));
        });
    });
  }

  public static listenToUser(
    userId: string,
    onUser: (user: UserDTO) => void,
    onError: (error: StorageError) => void,
  ): () => void {
    return onSnapshot(
      this.getDocRef(userId),
      (doc) => {
        if (doc.exists()) {
          onUser(doc.data() as UserDTO);
        } else {
          onError(
            new NotFoundError(`User with id ${userId} could not be found`),
          );
        }
      },
      (error) => {
        onError(convertUnknownErrorToStorageError(error, "Failed to get user"));
      },
    );
  }

  public static async setUserDoc(
    uid: string,
    user: Partial<UserDTO>,
  ): Promise<void> {
    return new Promise<void>((res, reject) => {
      setDoc(this.getDocRef(uid), user)
        .then(() => {
          res();
        })
        .catch((err) => {
          reject(
            convertUnknownErrorToStorageError(err, "Failed to update user"),
          );
        });
    });
  }
}
