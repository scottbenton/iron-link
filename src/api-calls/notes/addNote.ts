import { addDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";

import { getNoteCollection } from "./_getRef";

export const addNote = createApiFunction<
  {
    uid: string;
    campaignId: string;
    parentFolderId: string;
    order: number;
    title: string;
  },
  string
>((params) => {
  const { uid, campaignId, title, order, parentFolderId } = params;

  return new Promise((resolve, reject) => {
    addDoc(getNoteCollection(campaignId), {
      order,
      creator: uid,
      title,
      parentFolderId,
      readPermissions: null,
      editPermissions: null,
    })
      .then((doc) => {
        resolve(doc.id);
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to add note.");
