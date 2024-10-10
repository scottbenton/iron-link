import { AssetDocument } from "api-calls/assets/_asset.type";
import { CampaignDocument } from "api-calls/campaign/_campaign.type";
import { atom, useSetAtom } from "jotai";

export interface ICurrentCampaignAtom {
  campaignId: string;
  campaign: CampaignDocument | null;
  loading: boolean;
  error?: string;
  sharedAssets: {
    loading: boolean;
    assets: Record<string, AssetDocument>;
    error?: string;
  };
}

export const defaultCurrentCampaignAtom: ICurrentCampaignAtom = {
  campaignId: "",
  campaign: null,
  loading: true,
  sharedAssets: {
    loading: true,
    assets: {},
  },
};

export const currentCampaignAtom = atom<ICurrentCampaignAtom>(
  defaultCurrentCampaignAtom
);

export function useSetCurrentCampaignAtom() {
  return useSetAtom(currentCampaignAtom);
}
