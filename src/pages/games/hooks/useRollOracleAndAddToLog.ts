import { useRollOracle } from "hooks/useRollOracle";
import { useCallback } from "react";
import { useAuthAtom } from "atoms/auth.atom";
import { useParams } from "react-router-dom";
import { addRoll } from "api-calls/game-log/addRoll";
import { createId } from "lib/id.lib";
import { OracleTableRoll } from "types/DieRolls.type";

export function useRollOracleAndAddToLog() {
  const uid = useAuthAtom()[0].uid;
  const { characterId, campaignId } = useParams<{
    characterId?: string;
    campaignId?: string;
  }>();

  const rollOracle = useRollOracle();

  const handleRollOracle = useCallback(
    (
      oracleId: string,
      gmOnly: boolean = false
    ): { id: string | undefined; result: OracleTableRoll | undefined } => {
      const result = rollOracle(oracleId);
      if (result) {
        const resultWithAdditions = {
          ...result,
          uid,
          characterId: characterId ?? null,
          gmOnly,
        };
        if (campaignId) {
          const rollId = createId();
          addRoll({ campaignId, rollId, roll: resultWithAdditions }).then(
            () => {
              console.log("Roll added to log");
            }
          );
          return {
            id: rollId,
            result: resultWithAdditions,
          };
        }
        return {
          id: undefined,
          result: resultWithAdditions,
        };
      }
      return {
        id: undefined,
        result: undefined,
      };
    },
    [uid, characterId, campaignId, rollOracle]
  );

  return handleRollOracle;
}
