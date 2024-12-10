import { addDoc } from "firebase/firestore";

import {
  CampaignDocument,
  CampaignType,
} from "api-calls/campaign/_campaign.type";
import { getCampaignCollection } from "api-calls/campaign/_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

import { ExpansionConfig, RulesetConfig } from "repositories/game.repository";

export const createCampaign = createApiFunction<
  {
    uid: string;
    campaignName: string;
    campaignType: CampaignType;
    rulesets: RulesetConfig;
    expansions: ExpansionConfig;
  },
  string
>((params) => {
  const { uid, campaignName, campaignType, rulesets, expansions } = params;
  return new Promise((resolve, reject) => {
    const storedCampaign: CampaignDocument = {
      name: campaignName,
      users: [uid],
      gmIds: campaignType === CampaignType.Coop ? [uid] : [],
      characters: [],
      type: campaignType,
      rulesets,
      expansions,
    };

    addDoc(getCampaignCollection(), storedCampaign)
      .then((doc) => {
        resolve(doc.id);
      })
      .catch((err) => {
        reject(err);
      });
  });
}, "Error creating campaign.");
