import { deleteDoc, getDocs } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";

import {
  getCampaignGameLogCollection,
  getCampaignGameLogDocument,
} from "./_getRef";

function getAllLogs(campaignId: string): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    getDocs(getCampaignGameLogCollection(campaignId))
      .then((snapshot) => {
        const ids = snapshot.docs.map((doc) => doc.id);
        resolve(ids);
      })
      .catch(() => {
        reject("Failed to get game logs.");
      });
  });
}

export const deleteAllLogs = createApiFunction<string, void>((campaignId) => {
  return new Promise<void>((resolve, reject) => {
    getAllLogs(campaignId)
      .then((logIds) => {
        const promises = logIds.map((logId) =>
          deleteDoc(getCampaignGameLogDocument(campaignId, logId)),
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
}, "Failed to delete some or all logs.");
