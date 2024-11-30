import { arrayRemove, arrayUnion, setDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";

import { getCampaignSettingsDoc, getCharacterSettingsDoc } from "./_getRef";

export const showOrHideCustomOracle = createApiFunction<
  {
    campaignId?: string;
    characterId?: string;
    oracleId: string;
    hidden: boolean;
  },
  void
>((params) => {
  const { campaignId, characterId, oracleId, hidden } = params;

  return new Promise((resolve, reject) => {
    if (!campaignId && !characterId) {
      reject(new Error("Either character or campaign ID must be defined."));
      return;
    }

    setDoc(
      campaignId
        ? getCampaignSettingsDoc(campaignId)
        : getCharacterSettingsDoc(characterId as string),
      {
        hiddenCustomOraclesIds: hidden
          ? arrayUnion(oracleId)
          : arrayRemove(oracleId),
      },
      { merge: true },
    )
      .then(() => resolve())
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to update visibility of custom oracle.");
