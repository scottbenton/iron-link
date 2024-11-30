import { Box, Typography } from "@mui/material";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { DebouncedConditionMeter } from "components/datasworn/ConditonMeter";

import { updateCharacter } from "api-calls/character/updateCharacter";

import { useCharacterId } from "../../hooks/useCharacterId";
import { useDerivedCurrentCharacterState } from "../../hooks/useDerivedCharacterState";
import { useIsOwnerOfCharacter } from "../../hooks/useIsOwnerOfCharacter";

export function ExperienceSection() {
  const characterId = useCharacterId();
  const isCharacterOwner = useIsOwnerOfCharacter();

  const unspentExperience = useDerivedCurrentCharacterState(
    (character) => character?.characterDocument.data?.unspentExperience ?? 0,
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
    [characterId],
  );

  return (
    <Box>
      <Typography
        variant="h6"
        textTransform="uppercase"
        fontFamily="fontFamilyTitle"
      >
        {t("character.character-sidebar.experience", "Experience")}
      </Typography>
      <DebouncedConditionMeter
        label={t(
          "character.character-sidebar.unspent-experience",
          "Unspent Experience",
        )}
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
