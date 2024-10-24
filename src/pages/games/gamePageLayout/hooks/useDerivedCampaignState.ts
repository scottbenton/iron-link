import { useMemo } from "react";
import { useAtomValue } from "jotai";

import {
  currentCampaignAtom,
  ICurrentCampaignAtom,
} from "../atoms/campaign.atom";
import { CampaignDocument } from "api-calls/campaign/_campaign.type";
import { derivedAtomWithEquality } from "atoms/derivedAtomWithEquality";

export function useDerivedCampaignDocumentState<T>(
  select: (campaign: CampaignDocument | undefined) => T,
): T {
  return useAtomValue(
    useMemo(
      () =>
        derivedAtomWithEquality(currentCampaignAtom, (campaignAtom) =>
          select(campaignAtom.campaign ?? undefined),
        ),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    ),
  );
}

export function useDerivedCampaignState<T>(
  select: (atom: ICurrentCampaignAtom) => T,
): T {
  return useAtomValue(
    useMemo(
      () =>
        derivedAtomWithEquality(currentCampaignAtom, (campaignAtom) =>
          select(campaignAtom),
        ),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    ),
  );
}
