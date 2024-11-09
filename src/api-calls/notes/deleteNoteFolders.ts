import { getDocs } from "firebase/firestore";

import { getNoteFolderCollection } from "./_getRef";
import { removeNoteFolder } from "./removeNoteFolder";
import { createApiFunction } from "api-calls/createApiFunction";

function getAllNoteFolders(campaignId: string): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    getDocs(getNoteFolderCollection(campaignId))
      .then((snapshot) => {
        const ids = snapshot.docs.map((doc) => doc.id);
        resolve(ids);
      })
      .catch(() => {
        reject("Failed to get note folders.");
      });
  });
}

export const deleteNotes = createApiFunction<string, void>((campaignId) => {
  return new Promise<void>((resolve, reject) => {
    getAllNoteFolders(campaignId)
      .then((folderIds) => {
        const promises = folderIds.map((folderId) =>
          removeNoteFolder({ campaignId, folderId }),
        );
        Promise.all(promises)
          .then(() => {
            resolve();
          })
          .catch((e) => {
            reject(e);
          });
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to delete some or all note folders.");
