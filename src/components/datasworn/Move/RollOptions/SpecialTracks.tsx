import { Box, Button, Stack } from "@mui/material";
import { CharacterRollOptionState } from "./common.types";
import { ProgressTrack } from "components/datasworn/ProgressTrack";
import { useSpecialTrackRules } from "atoms/dataswornRules/useSpecialTrackRules";
import { useTranslation } from "react-i18next";
import { useRollCompleteSpecialTrack } from "pages/games/hooks/useRollCompleteSpecialTrack";

export interface SpecialTracksProps {
  moveId: string;
  moveName: string;
  tracks: string[];
  characterData: CharacterRollOptionState;
}

export function SpecialTracks(props: SpecialTracksProps) {
  const { moveId, moveName, tracks, characterData } = props;

  const { t } = useTranslation();

  const specialTracks = useSpecialTrackRules();

  const rollTrackProgress = useRollCompleteSpecialTrack();

  return (
    <Stack spacing={2}>
      {tracks.map((trackId) => (
        <Box key={trackId}>
          <ProgressTrack
            label={specialTracks[trackId].label}
            value={characterData.specialTracks?.[trackId]?.value ?? 0}
          />
          <Button
            variant={"outlined"}
            color="inherit"
            sx={{ mt: 1 }}
            onClick={() => {
              rollTrackProgress(
                trackId,
                specialTracks[trackId].label,
                characterData.specialTracks?.[trackId]?.value ?? 0,
                moveId
              );
            }}
          >
            {t("datasworn.move.roll-track-progress", "Roll {{moveName}}", {
              moveName,
            })}
          </Button>
        </Box>
      ))}
    </Stack>
  );
}
