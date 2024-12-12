import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import {
  RollResult,
  RollType,
  SpecialTrackProgressRoll,
} from "types/DieRolls.type";

import { addRoll } from "api-calls/game-log/addRoll";

import { useAddRollSnackbar, useSetAnnouncement } from "stores/appState.store";
import { useUID } from "stores/auth.store";

import { getRollResultLabel } from "data/rollResultLabel";

import { createId } from "lib/id.lib";

import { useCharacterIdOptional } from "../characterSheet/hooks/useCharacterId";
import { useIsOwnerOfCharacter } from "../characterSheet/hooks/useIsOwnerOfCharacter";
import { useGameId } from "../gamePageLayout/hooks/useGameId";
import { getRoll } from "./useRollStatAndAddToLog";

export function useRollCompleteSpecialTrack() {
  const { t } = useTranslation();
  // TODO - remove ?? "" and handle the case where there is no UID
  const uid = useUID() ?? "";

  const gameId = useGameId();

  const characterId = useCharacterIdOptional();
  const isCharacterOwner = useIsOwnerOfCharacter();

  const addRollToScreen = useAddRollSnackbar();
  const announce = useSetAnnouncement();

  const rollSpecialTrack = useCallback(
    (
      specialTrackKey: string,
      trackLabel: string,
      trackProgress: number,
      moveId: string,
    ) => {
      const challenge1 = getRoll(10);
      const challenge2 = getRoll(10);

      let result: RollResult = RollResult.WeakHit;
      if (trackProgress > challenge1 && trackProgress > challenge2) {
        result = RollResult.StrongHit;
      } else if (trackProgress <= challenge1 && trackProgress <= challenge2) {
        result = RollResult.Miss;
      }

      const trackProgressRoll: SpecialTrackProgressRoll = {
        type: RollType.SpecialTrackProgress,
        rollLabel: trackLabel,
        timestamp: new Date(),
        challenge1,
        challenge2,
        trackProgress,
        specialTrackKey,
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
          "Rolled progress for {{trackLabel}}. Your progress was {{trackProgress}} against a {{challenge1}} and a {{challenge2}} for a {{rollResult}}",
          {
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

  return rollSpecialTrack;
}
