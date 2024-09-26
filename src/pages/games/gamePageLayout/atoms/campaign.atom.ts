import { CampaignDocument } from "api-calls/campaign/_campaign.type";
import { atom, useSetAtom } from "jotai";

export const currentCampaignAtom = atom<{
  campaignId: string;
  campaign: CampaignDocument | null;
  loading: boolean;
  error?: string;
}>({
  campaignId: "",
  campaign: null,
  loading: true,
});

export function useSetCurrentCampaignAtom() {
  return useSetAtom(currentCampaignAtom);
}
