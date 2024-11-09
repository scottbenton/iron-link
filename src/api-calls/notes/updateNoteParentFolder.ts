import { updateDoc } from "firebase/firestore";

import { getNoteDocument } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const updateNoteParentFolder = createApiFunction<
  {
    campaignId: string;
    noteId: string;
    parentFolderId: string;
  },
  void
>((params) => {
  const { campaignId, noteId, parentFolderId } = params;

  return new Promise((resolve, reject) => {
    updateDoc(getNoteDocument(campaignId, noteId), {
      parentFolderId,
    })
      .then(() => resolve())
      .catch(reject);
  });
}, "Failed to move note.");
