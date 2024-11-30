import { runTransaction } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";

import { firestore } from "config/firebase.config";

import { getNoteContentDocument, getNoteFolderDocument } from "./_getRef";

export const removeNoteFolderTransaction = createApiFunction<
  {
    campaignId: string;
    folderIds: string[];
    noteIds: string[];
  },
  void
>((params) => {
  const { campaignId, folderIds, noteIds } = params;

  return new Promise((resolve, reject) => {
    runTransaction(firestore, async (transaction) => {
      for (const noteId of noteIds) {
        const noteDoc = getNoteFolderDocument(campaignId, noteId);
        const noteContentDoc = getNoteContentDocument(campaignId, noteId);
        transaction.delete(noteDoc);
        transaction.delete(noteContentDoc);
      }

      for (const folderId of folderIds) {
        const folderDoc = getNoteFolderDocument(campaignId, folderId);
        transaction.delete(folderDoc);
      }
    })
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
}, "Failed to remove folder.");
