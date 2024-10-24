import { deleteDoc, getDocs } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";
import {
  getNPCCollection,
  getNPCDoc,
  getPrivateDetailsNPCDoc,
  getPublicNotesNPCDoc,
} from "api-calls/world/npcs/_getRef";

interface Params {
  worldId: string;
}

export const deleteAllNPCs = createApiFunction<Params, void>((params) => {
  const { worldId } = params;

  return new Promise((resolve, reject) => {
    const promises: Promise<unknown>[] = [];
    getDocs(getNPCCollection(worldId))
      .then((docs) => {
        docs.forEach((doc) => {
          promises.push(deleteDoc(getNPCDoc(worldId, doc.id)));
          promises.push(deleteDoc(getPrivateDetailsNPCDoc(worldId, doc.id)));
          promises.push(deleteDoc(getPublicNotesNPCDoc(worldId, doc.id)));
        });
      })
      .catch((e) => {
        reject(e);
      });

    Promise.all(promises)
      .then(() => resolve())
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to delete npcs.");
