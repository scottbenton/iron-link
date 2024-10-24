import { firestore } from "config/firebase.config";
import {
  deleteDoc,
  deleteField,
  getDocs,
  query,
  runTransaction,
  where,
} from "firebase/firestore";

import {
  getCampaignCollection,
  getCampaignDoc,
} from "api-calls/campaign/_getRef";
import {
  getCharacterCollection,
  getCharacterDoc,
} from "api-calls/character/_getRef";
import { createApiFunction } from "api-calls/createApiFunction";
import { getWorldDoc } from "api-calls/world/_getRef";
import { deleteAllLocations } from "api-calls/world/locations/deleteAllLocations";
import { deleteAllLoreDocuments } from "api-calls/world/lore/deleteAllLoreDocuments";
import { deleteAllNPCs } from "api-calls/world/npcs/deleteAllNPCs";

export const deleteWorld = createApiFunction<string, void>((worldId) => {
  return new Promise((resolve, reject) => {
    const campaignsUsingWorld = getDocs(
      query(getCampaignCollection(), where("worldId", "==", worldId)),
    );
    const charactersUsingWorld = getDocs(
      query(getCharacterCollection(), where("worldId", "==", worldId)),
    );

    const promises: Promise<unknown>[] = [];
    promises.push(
      runTransaction(firestore, async (transaction) => {
        (await campaignsUsingWorld).docs.map((doc) => {
          transaction.update(getCampaignDoc(doc.id), {
            worldId: deleteField(),
          });
        });
        (await charactersUsingWorld).docs.map((doc) => {
          transaction.update(getCharacterDoc(doc.id), {
            worldId: deleteField(),
          });
        });
      }),
    );

    promises.push(deleteAllLocations({ worldId }));
    promises.push(deleteAllLoreDocuments({ worldId }));
    promises.push(deleteAllNPCs({ worldId }));

    Promise.all(promises)
      .then(() => {
        deleteDoc(getWorldDoc(worldId))
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
}, "Failed to delete world.");
