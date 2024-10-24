import { UpdateData, updateDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";
import { getUsersDoc } from "api-calls/user/_getRef";
import { UserDocument } from "api-calls/user/_user.type";

export const updateUserDocNestedFields = createApiFunction<
  { uid: string; user: UpdateData<UserDocument> },
  void
>((params) => {
  const { uid, user } = params;
  return new Promise((resolve, reject) => {
    updateDoc(getUsersDoc(uid), user)
      .then(() => {
        resolve();
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to update user");
      });
  });
}, "Failed to update user information.");
