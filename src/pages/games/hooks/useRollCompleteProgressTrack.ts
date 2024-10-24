import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { addRoll } from "api-calls/game-log/addRoll";
import { useSetAnnouncement } from "atoms/announcement.atom";
import { useUID } from "atoms/auth.atom";
import { useAddRollSnackbar } from "atoms/rollDisplay.atom";
import { getRollResultLabel } from "data/rollResultLabel";
import { createId } from "lib/id.lib";
import { getTrackTypeLabel } from "pages/games/characterSheet/components/TracksSection/common";
import { useCharacterIdOptional } from "pages/games/characterSheet/hooks/useCharacterId";
import { useIsOwnerOfCharacter } from "pages/games/characterSheet/hooks/useIsOwnerOfCharacter";
import { useCampaignId } from "pages/games/gamePageLayout/hooks/useCampaignId";
import { getRoll } from "pages/games/hooks/useRollStatAndAddToLog";
import { RollResult, RollType, TrackProgressRoll } from "types/DieRolls.type";
import { TrackTypes } from "types/Track.type";

export function useRollCompleteProgressTrack() {
  const { t } = useTranslation();
  const uid = useUID();

  const campaignId = useCampaignId();

  const characterId = useCharacterIdOptional();
  const isCharacterOwner = useIsOwnerOfCharacter();

  const addRollToScreen = useAddRollSnackbar();
  const announce = useSetAnnouncement();

  const rollProgressTrack = useCallback(
    (
      trackType: TrackTypes,
      trackLabel: string,
      trackProgress: number,
      moveId: string,
    ) => {
      const challenge1 = getRoll(10);
      const challenge2 = getRoll(10);

      let result: RollResult = RollResult.WeakHit;
      if (trackProgress > challenge1 && trackProgress > challenge2) {
        result = RollResult.StrongHit;
        // Strong Hit
      } else if (trackProgress <= challenge1 && trackProgress <= challenge2) {
        result = RollResult.Miss;
      }

      const trackProgressRoll: TrackProgressRoll = {
        type: RollType.TrackProgress,
        rollLabel: trackLabel,
        timestamp: new Date(),
        challenge1,
        challenge2,
        trackProgress,
        trackType,
        result,
        characterId: isCharacterOwner ? (characterId ?? null) : null,
        uid,
        gmsOnly: false,
        moveId,
      };
      const rollId = createId();

      addRollToScreen(rollId, trackProgressRoll);
      addRoll({
        campaignId,
        rollId,
        roll: trackProgressRoll,
      }).catch(() => {});

      announce(
        t(
          "datasworn.roll.trackProgress",
          "Rolled progress for {{trackType}} {{trackLabel}}. Your progress was {{trackProgress}} against a {{challenge1}} and a {{challenge2}} for a {{rollResult}}",
          {
            trackType: getTrackTypeLabel(trackType, t),
            trackLabel,
            trackProgress,
            challenge1,
            challenge2,
            rollResult: getRollResultLabel(result),
          },
        ),
      );

      return result;
    },
    [
      announce,
      addRollToScreen,
      campaignId,
      characterId,
      uid,
      isCharacterOwner,
      t,
    ],
  );

  return rollProgressTrack;
}
