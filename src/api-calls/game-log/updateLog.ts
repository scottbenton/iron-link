import { createApiFunction } from "api-calls/createApiFunction";
import { updateDoc } from "firebase/firestore";
import { Roll } from "types/DieRolls.type";
import {
  convertRollToGameLogDocument,
  getCampaignGameLogDocument,
} from "./_getRef";

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
