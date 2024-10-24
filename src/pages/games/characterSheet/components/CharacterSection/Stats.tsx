import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import RollIcon from "@mui/icons-material/Casino";
import { Box, Typography } from "@mui/material";

import { useCharacterId } from "../../hooks/useCharacterId";
import { useDerivedCharacterState } from "../../hooks/useDerivedCharacterState";
import { useIsOwnerOfCharacter } from "../../hooks/useIsOwnerOfCharacter";
import { updateCharacter } from "api-calls/character/updateCharacter";
import { useStatRules } from "atoms/dataswornRules/useStatRules";
import { DebouncedConditionMeter } from "components/datasworn/ConditonMeter";
import { Stat } from "components/datasworn/Stat";
import { useRollStatAndAddToLog } from "pages/games/hooks/useRollStatAndAddToLog";

export function Stats() {
  const characterId = useCharacterId();
  const { stats, adds, momentum } = useDerivedCharacterState(
    characterId,
    (character) => ({
      stats: character?.characterDocument.data?.stats ?? {},
      adds: character?.characterDocument.data?.adds ?? 0,
      momentum: character?.characterDocument.data?.momentum ?? 2,
    }),
  );
  const isCharacterOwner = useIsOwnerOfCharacter();

  const { t } = useTranslation();

  const statRules = useStatRules();

  const handleAddsChange = useCallback(
    (value: number) => {
      if (characterId) {
        updateCharacter({
          characterId,
          character: { adds: value },
        }).catch(() => {});
      }
    },
    [characterId],
  );

  const rollStat = useRollStatAndAddToLog();

  return (
    <Box>
      <Typography
        variant="h6"
        textTransform={"uppercase"}
        fontFamily="fontFamilyTitle"
      >
        {t("character.character-sidebar.stats", "Stats")}
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={1}>
        {Object.entries(statRules).map(([key, statRule]) => (
          <Stat
            key={key}
            label={statRule.label}
            value={stats[key] ?? 0}
            action={
              isCharacterOwner
                ? {
                    actionLabel: t("common.roll", "Roll"),
                    ActionIcon: RollIcon,
                  }
                : undefined
            }
            onActionClick={
              isCharacterOwner
                ? () =>
                    rollStat({
                      statId: key,
                      statLabel: statRule.label,
                      statModifier: stats[key] ?? 0,
                      adds,
                      momentum,
                    })
                : undefined
            }
          />
        ))}
        <DebouncedConditionMeter
          label={t("character.character-sidebar.adds", "Adds")}
          min={-9}
          max={9}
          defaultValue={0}
          disabled={!isCharacterOwner}
          value={adds}
          onChange={handleAddsChange}
        />
      </Box>
    </Box>
  );
}
