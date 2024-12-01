import { TFunction } from "i18next";

import { CampaignType } from "api-calls/campaign/_campaign.type";
import { GUIDE_NOTE_FOLDER_NAME } from "api-calls/notes/_getRef";

import { FAKE_ROOT_NOTE_FOLDER_KEY } from "./rootNodeName";

export function getItemName(params: {
  name: string;
  id: string;
  uid: string | undefined;
  t: TFunction;
  campaignType: CampaignType;
}): string {
  const { name, id, uid, t, campaignType } = params;

  if (id === uid) {
    return t("notes.user-folder", "Your Notes");
  } else if (id === GUIDE_NOTE_FOLDER_NAME) {
    if (campaignType === CampaignType.Coop) {
      return t("notes.guide-folder-coop-name", "Shared Notes");
    }
    return t("notes.guide-folder", "Guide Notes");
  } else if (id === FAKE_ROOT_NOTE_FOLDER_KEY) {
    return t("notes.root-folder", "Notes");
  }

  return name;
}
