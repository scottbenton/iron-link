import { updateDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";

import { getNoteDocument } from "./_getRef";

export const updateNoteOrder = createApiFunction<
  {
    campaignId: string;
    noteId: string;
    order: number;
  },
  void
>((params) => {
  const { campaignId, noteId, order } = params;
  return new Promise((resolve, reject) => {
    updateDoc(getNoteDocument(campaignId, noteId), {
      order,
    })
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to reorder note.");
