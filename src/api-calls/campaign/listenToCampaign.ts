import { onSnapshot } from "firebase/firestore";

import { CampaignDocument } from "./_campaign.type";
import { getCampaignDoc } from "./_getRef";

export function listenToCampaign(
  campaignId: string,
  onCampaign: (campaign: CampaignDocument) => void,
  onError: (error: unknown) => void,
) {
  return onSnapshot(
    getCampaignDoc(campaignId),
    (snapshot) => {
      const campaign = snapshot.data();
      if (campaign) {
        onCampaign(campaign);
      } else {
        onError("No campaign found");
      }
    },
    (error) => onError(error),
  );
}
