import { Box, Typography } from "@mui/material";
import { useCallback } from "react";

import { updateCharacter } from "api-calls/character/updateCharacter";
import { useSpecialTrackRules } from "atoms/dataswornRules/useSpecialTrackRules";
import { DebouncedProgressTrack } from "components/datasworn/ProgressTrack";
import { useCharacterId } from "pages/games/characterSheet/hooks/useCharacterId";
import { useDerivedCharacterState } from "pages/games/characterSheet/hooks/useDerivedCharacterState";
import { useIsOwnerOfCharacter } from "pages/games/characterSheet/hooks/useIsOwnerOfCharacter";

export function LegacyTracks() {
  const characterId = useCharacterId();
  const isCharacterOwner = useIsOwnerOfCharacter();

  const legacyTracks = useDerivedCharacterState(
    characterId,
    (character) => character?.characterDocument.data?.specialTracks ?? {},
  );
  const specialTrackRules = useSpecialTrackRules();

  const handleProgressTrackChange = useCallback(
    (key: string, value: number) => {
      if (characterId) {
        updateCharacter({
          characterId,
          character: { [`specialTracks.${key}.value`]: value },
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
        Legacy Tracks
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={1}>
        {Object.entries(specialTrackRules).map(([key, specialTrack]) => (
          <Box key={key} display="flex" alignItems="center">
            <DebouncedProgressTrack
              progressTrackKey={key}
              label={specialTrack.label}
              value={legacyTracks[key]?.value ?? 0}
              onChange={
                isCharacterOwner ? handleProgressTrackChange : undefined
              }
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
