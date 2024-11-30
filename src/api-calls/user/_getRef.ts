import { DocumentReference, doc } from "firebase/firestore";

import { UserDocument } from "api-calls/user/_user.type";

import { firestore } from "config/firebase.config";

export function constructUserDocPath(userId: string) {
  return `/users/${userId}`;
}

export function getUsersDoc(userId: string) {
  return doc(
    firestore,
    constructUserDocPath(userId),
  ) as DocumentReference<UserDocument>;
}
