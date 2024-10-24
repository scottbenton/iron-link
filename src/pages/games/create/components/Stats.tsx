import { useTranslation } from "react-i18next";
import { Box, Typography } from "@mui/material";

import { useStatRules } from "atoms/dataswornRules/useStatRules";
import { ConditionMeter } from "components/datasworn/ConditonMeter";
import { useCreateCharacterAtom } from "pages/games/create/atoms/createCharacter.atom";

export function Stats() {
  const [character, setCharacter] = useCreateCharacterAtom();
  const { stats: statValues } = character;

  const { t } = useTranslation();
  const stats = useStatRules();

  return (
    <>
      <Box mt={1}>
        <Typography
          display={"flex"}
          alignItems={"baseline"}
          color={"text.secondary"}
          sx={{ mr: 1 }}
        >
          {t(
            "character.create.choose-stats-helper-text",
            "Select a value for each stat.",
          )}
        </Typography>
      </Box>
      <Box display={"flex"} flexWrap={"wrap"} gap={1}>
        {Object.entries(stats).map(([statKey, stat]) => (
          <ConditionMeter
            key={statKey}
            label={stat.label}
            min={-9}
            max={9}
            defaultValue={0}
            value={statValues[statKey] ?? 0}
            onChange={(newValue) => {
              setCharacter((prev) => ({
                ...prev,
                stats: {
                  ...prev.stats,
                  [statKey]: newValue,
                },
              }));
            }}
          />
        ))}
      </Box>
    </>
  );
}
