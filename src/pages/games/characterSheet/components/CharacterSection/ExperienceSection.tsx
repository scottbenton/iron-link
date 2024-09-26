import { Box, Typography } from "@mui/material";
import { updateCharacter } from "api-calls/character/updateCharacter";
import { DebouncedConditionMeter } from "components/datasworn/ConditonMeter";
import { useTranslation } from "react-i18next";
import { useCharacterId } from "../../hooks/useCharacterId";
import { useDerivedCharacterState } from "../../hooks/useDerivedCharacterState";
import { useCallback } from "react";
import { useIsOwnerOfCharacter } from "../../hooks/useIsOwnerOfCharacter";

export function ExperienceSection() {
  const characterId = useCharacterId();
  const isCharacterOwner = useIsOwnerOfCharacter();

  const unspentExperience = useDerivedCharacterState(
    characterId,
    (character) => character?.characterDocument.data?.unspentExperience ?? 0
  );

  const { t } = useTranslation();

  const handleExperienceChange = useCallback(
    (value: number) => {
      if (characterId) {
        updateCharacter({
          characterId,
          character: { unspentExperience: value },
        }).catch(() => {});
      }
    },
    [characterId]
  );

  return (
    <Box>
      <Typography
        variant="h6"
        textTransform="uppercase"
        fontFamily="fontFamilyTitle"
      >
        {t("Experience")}
      </Typography>
      <DebouncedConditionMeter
        label={t("Unspent Experience")}
        min={0}
        max={100}
        defaultValue={0}
        value={unspentExperience}
        onChange={handleExperienceChange}
        disabled={!isCharacterOwner}
      />
    </Box>
  );
}
