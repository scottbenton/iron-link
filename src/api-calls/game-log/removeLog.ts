import { deleteDoc } from "firebase/firestore";

import { getCampaignGameLogDocument } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const removeLog = createApiFunction<
  { campaignId: string; logId: string },
  void
>((params) => {
  const { campaignId, logId } = params;

  return new Promise((resolve, reject) => {
    const docRef = getCampaignGameLogDocument(campaignId as string, logId);

    deleteDoc(docRef)
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
}, "Failed to delete roll.");
