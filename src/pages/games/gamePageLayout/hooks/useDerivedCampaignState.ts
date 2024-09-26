import { CampaignDocument } from "api-calls/campaign/_campaign.type";
import { derivedAtomWithEquality } from "atoms/derivedAtomWithEquality";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { currentCampaignAtom } from "../atoms/campaign.atom";

export function useDerivedCampaignState<T>(
  select: (campaign: CampaignDocument | undefined) => T
): T {
  return useAtomValue(
    useMemo(
      () =>
        derivedAtomWithEquality(currentCampaignAtom, (campaignAtom) =>
          select(campaignAtom.campaign ?? undefined)
        ),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    )
  );
}
