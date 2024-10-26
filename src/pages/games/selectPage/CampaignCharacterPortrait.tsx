import { useMemo } from "react";
import { atom, useAtomValue } from "jotai";

import { usersCampaignsAtom } from "atoms/users.campaigns";
import { PortraitAvatar } from "components/characters/PortraitAvatar";

export interface CampaignCharacterPortraitProps {
  characterId: string;
}

export function CampaignCharacterPortrait(
  props: CampaignCharacterPortraitProps,
) {
  const { characterId } = props;
  const characterPortraitSettings = useAtomValue(
    useMemo(
      () =>
        atom(
          (get) =>
            get(usersCampaignsAtom).campaignCharacterPortraitSettings[
              characterId
            ],
        ),
      [characterId],
    ),
  );

  return (
    <PortraitAvatar
      characterId={characterId}
      portraitSettings={characterPortraitSettings.settings ?? undefined}
      name={characterPortraitSettings.name}
      size={"small"}
    />
  );
}
