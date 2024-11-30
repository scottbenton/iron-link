import { arrayRemove, updateDoc } from "firebase/firestore";

import { CampaignDocument } from "api-calls/campaign/_campaign.type";
import { createApiFunction } from "api-calls/createApiFunction";

import { getCampaignDoc } from "./_getRef";
import { removeCharacterFromCampaign } from "./removeCharacterFromCampaign";
import { updateCampaignGM } from "./updateCampaignGM";

export const leaveCampaign = createApiFunction<
  { uid: string; campaignId: string; campaign: CampaignDocument },
  void
>(async (params) => {
  const { uid, campaignId, campaign } = params;
  return new Promise((resolve, reject) => {
    const allPromises: Promise<unknown>[] = [];

    if (campaign.gmIds?.includes(uid)) {
      allPromises.push(
        updateCampaignGM({ campaignId, gmId: uid, shouldRemove: true }),
      );
    }
    Object.values(campaign.characters).forEach((character) => {
      if (character.uid === uid) {
        allPromises.push(
          removeCharacterFromCampaign({
            uid,
            campaignId,
            characterId: character.characterId,
          }),
        );
      }
    });

    allPromises.push(
      updateDoc(getCampaignDoc(campaignId), {
        users: arrayRemove(uid),
      }),
    );

    Promise.all(allPromises)
      .then(() => resolve())
      .catch(reject);
    return;
  });
}, "Failed to remove user from campaign.");
