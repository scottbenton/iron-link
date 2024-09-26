import { Box, Typography } from "@mui/material";
import { updateCharacter } from "api-calls/character/updateCharacter";
import { useStatRules } from "atoms/dataswornRules/useStatRules";
import { DebouncedConditionMeter } from "components/datasworn/ConditonMeter";
import { Stat } from "components/datasworn/Stat";
import { useTranslation } from "react-i18next";
import { useCharacterId } from "../../hooks/useCharacterId";
import { useDerivedCharacterState } from "../../hooks/useDerivedCharacterState";
import { useCallback } from "react";
import { useIsCharacterOwner } from "../../hooks/useIsCharacterOwner";
import RollIcon from "@mui/icons-material/Casino";
import { useRollStatAndAddToLog } from "pages/games/hooks/useRollStatAndAddToLog";

export function Stats() {
  const characterId = useCharacterId();
  const { stats, adds, momentum } = useDerivedCharacterState(
    characterId,
    (character) => ({
      stats: character?.characterDocument.data?.stats ?? {},
      adds: character?.characterDocument.data?.adds ?? 0,
      momentum: character?.characterDocument.data?.momentum ?? 2,
    })
  );
  const isCharacterOwner = useIsCharacterOwner();

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
    [characterId]
  );

  const rollStat = useRollStatAndAddToLog();

  return (
    <Box>
      <Typography
        variant="h6"
        textTransform={"uppercase"}
        fontFamily="fontFamilyTitle"
      >
        {t("Stats")}
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={1}>
        {Object.entries(statRules).map(([key, statRule]) => (
          <Stat
            key={key}
            label={statRule.label}
            value={stats[key] ?? 0}
            action={{
              actionLabel: t("Roll"),
              ActionIcon: RollIcon,
            }}
            onActionClick={() =>
              rollStat({
                statId: key,
                statLabel: statRule.label,
                statModifier: stats[key] ?? 0,
                adds,
                momentum,
              })
            }
          />
        ))}
        <DebouncedConditionMeter
          label={t("Adds")}
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
