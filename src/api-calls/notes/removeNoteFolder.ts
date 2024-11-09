import { deleteDoc } from "firebase/firestore";

import { getNoteFolderDocument } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const removeNoteFolder = createApiFunction<
  {
    campaignId: string;
    folderId: string;
  },
  void
>((params) => {
  const { campaignId, folderId } = params;

  return new Promise((resolve, reject) => {
    deleteDoc(getNoteFolderDocument(campaignId, folderId))
      .then(() => resolve())
      .catch((e) => reject(e));
  });
}, "Failed to remove folder.");
