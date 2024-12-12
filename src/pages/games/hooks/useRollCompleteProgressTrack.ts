import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { RollResult, RollType, TrackProgressRoll } from "types/DieRolls.type";
import { TrackTypes } from "types/Track.type";

import { addRoll } from "api-calls/game-log/addRoll";

import { useAddRollSnackbar, useSetAnnouncement } from "stores/appState.store";
import { useUID } from "stores/auth.store";

import { getRollResultLabel } from "data/rollResultLabel";

import { createId } from "lib/id.lib";

import { getTrackTypeLabel } from "../characterSheet/components/TracksSection/common";
import { useCharacterIdOptional } from "../characterSheet/hooks/useCharacterId";
import { useIsOwnerOfCharacter } from "../characterSheet/hooks/useIsOwnerOfCharacter";
import { useGameId } from "../gamePageLayout/hooks/useGameId";
import { getRoll } from "./useRollStatAndAddToLog";

export function useRollCompleteProgressTrack() {
  const { t } = useTranslation();
  // TODO - remove ?? "" and handle the case where there is no UID
  const uid = useUID() ?? "";

  const gameId = useGameId();

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
        gameId,
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
    [announce, addRollToScreen, gameId, characterId, uid, isCharacterOwner, t],
  );

  return rollProgressTrack;
}
