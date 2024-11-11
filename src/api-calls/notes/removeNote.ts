import { deleteDoc } from "firebase/firestore";

import { getNoteContentDocument, getNoteDocument } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const removeNote = createApiFunction<
  {
    campaignId: string;
    noteId: string;
  },
  void
>((params) => {
  const { campaignId, noteId } = params;

  return new Promise((resolve, reject) => {
    const deleteNotePromise = deleteDoc(getNoteDocument(campaignId, noteId));

    const deleteContentPromise = deleteDoc(
      getNoteContentDocument(campaignId, noteId),
    );

    Promise.all([deleteNotePromise, deleteContentPromise])
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to remove note.");
