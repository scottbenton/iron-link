import { updateDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";
import {
  convertRollToGameLogDocument,
  getCampaignGameLogDocument,
} from "api-calls/game-log/_getRef";
import { Roll } from "types/DieRolls.type";

export const updateLog = createApiFunction<
  { campaignId: string; logId: string; log: Roll },
  void
>((params) => {
  const { campaignId, logId, log } = params;

  return new Promise((resolve, reject) => {
    const docRef = getCampaignGameLogDocument(campaignId, logId);

    updateDoc(docRef, convertRollToGameLogDocument(log))
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
}, "Failed to update roll.");
