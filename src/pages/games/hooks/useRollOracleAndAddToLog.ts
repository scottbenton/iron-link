import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { useSnackbar } from "providers/SnackbarProvider";

import { OracleTableRoll } from "types/DieRolls.type";

import { useRollOracle } from "hooks/useRollOracle";

import { addRoll } from "api-calls/game-log/addRoll";

import { useAddRollSnackbar } from "stores/appState.store";
import { useUID } from "stores/auth.store";

import { createId } from "lib/id.lib";

import { useDerivedCharacterState } from "../characterSheet/hooks/useDerivedCharacterState";

export function useRollOracleAndAddToLog() {
  // TODO - remove ?? "" and handle the case where there is no UID
  const uid = useUID() ?? "";
  const { characterId, gameId } = useParams<{
    characterId?: string;
    gameId?: string;
  }>();

  const characterOwner = useDerivedCharacterState(
    characterId,
    (character) => character?.characterDocument.data?.uid,
  );

  const addRollSnackbar = useAddRollSnackbar();

  const { t } = useTranslation();

  const { error } = useSnackbar();

  const rollOracle = useRollOracle();

  const handleRollOracle = useCallback(
    (
      oracleId: string,
      gmOnly: boolean = false,
    ): { id: string | undefined; result: OracleTableRoll | undefined } => {
      const result = rollOracle(oracleId);
      if (result) {
        const resultWithAdditions = {
          ...result,
          uid,
          characterId:
            characterId && characterOwner === uid ? characterId : null,
          gmOnly,
        };
        if (gameId) {
          const rollId = createId();
          addRoll({ gameId, rollId, roll: resultWithAdditions }).catch(
            () => {},
          );
          addRollSnackbar(rollId, resultWithAdditions);
          return {
            id: rollId,
            result: resultWithAdditions,
          };
        }
        addRollSnackbar(undefined, resultWithAdditions);
        return {
          id: undefined,
          result: resultWithAdditions,
        };
      } else {
        error(
          t("datasworn.roll-oracle.oracle-not-found", "Could not find oracle"),
        );
      }
      return {
        id: undefined,
        result: undefined,
      };
    },
    [
      uid,
      characterId,
      gameId,
      rollOracle,
      error,
      t,
      addRollSnackbar,
      characterOwner,
    ],
  );

  return handleRollOracle;
}
