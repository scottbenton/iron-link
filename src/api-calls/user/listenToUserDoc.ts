import { onSnapshot } from "firebase/firestore";

import { UserDocument } from "api-calls/user/_user.type";

import { getUsersDoc } from "./_getRef";

export const listenToUserDoc = (
  uid: string,
  onUser: (user: UserDocument) => void,
) => {
  return onSnapshot(
    getUsersDoc(uid),
    (snapshot) => {
      if (!snapshot.metadata.fromCache) {
        const user: UserDocument | undefined = snapshot.data();
        if (user) {
          onUser(user);
        }
      }
    },
    (error) => console.error(error),
  );
};
