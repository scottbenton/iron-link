import { getDocs } from "firebase/firestore";

import { getNoteCollection, getNoteFolderCollection } from "./_getRef";
import { removeNote } from "./removeNote";
import { createApiFunction } from "api-calls/createApiFunction";

function getAllFolders(campaignId: string): Promise<string[]> {
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

function getAllNotes(campaignId: string): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    getDocs(getNoteCollection(campaignId))
      .then((snapshot) => {
        const ids = snapshot.docs.map((doc) => doc.id);
        resolve(ids);
      })
      .catch(() => {
        reject("Failed to get notes.");
      });
  });
}

export const deleteNotes = createApiFunction<string, void>((campaignId) => {
  return new Promise<void>((resolve, reject) => {
    getAllNotes(campaignId)
      .then((noteIds) => {
        const promises = noteIds.map((noteId) =>
          removeNote({ campaignId, noteId }),
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
    getAllFolders(campaignId).then((noteIds) => {
      const promises = noteIds.map((noteId) =>
        removeNote({ campaignId, noteId }),
      );
      Promise.all(promises)
        .then(() => {
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
}, "Failed to delete some or all note folders.");
