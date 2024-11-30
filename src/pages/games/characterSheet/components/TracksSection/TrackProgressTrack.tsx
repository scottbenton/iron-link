import CheckIcon from "@mui/icons-material/Check";
import { Box, Button } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { DebouncedClockCircle } from "components/datasworn/Clocks/DebouncedClockCircle";
import { ProgressTrack } from "components/datasworn/ProgressTrack";

import {
  Difficulty,
  ProgressTrack as IProgressTrack,
  SceneChallenge,
  TrackStatus,
  TrackTypes,
} from "types/Track.type";

import { removeProgressTrack } from "api-calls/tracks/removeProgressTrack";
import { updateProgressTrack } from "api-calls/tracks/updateProgressTrack";

import { useSetAnnouncement } from "atoms/announcement.atom";

import { useIsOwnerOfCharacter } from "../../hooks/useIsOwnerOfCharacter";
import { EditOrCreateTrackDialog } from "./EditOrCreateTrackDialog";
import { TrackCompletionMoveButton } from "./TrackCompletionMoveButton";
import { getTrackTypeLabel, trackCompletionMoveIds } from "./common";

export interface TrackProgressTrackProps {
  trackId: string;
  track: IProgressTrack | SceneChallenge;
  canEdit: boolean;
  gameId: string;
}

const difficultySteps: Record<Difficulty, number> = {
  [Difficulty.Troublesome]: 12,
  [Difficulty.Dangerous]: 8,
  [Difficulty.Formidable]: 4,
  [Difficulty.Extreme]: 2,
  [Difficulty.Epic]: 1,
};

export function TrackProgressTrack(props: TrackProgressTrackProps) {
  const { trackId, track, canEdit, gameId } = props;

  const isCharacterOwner = useIsOwnerOfCharacter();

  const { t } = useTranslation();
  const announce = useSetAnnouncement();
  const confirm = useConfirm();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleStatusChange = (status: TrackStatus) => {
    updateProgressTrack({
      gameId,
      trackId,
      track: {
        ...track,
        status,
      },
    })
      .then(() => {
        announce(
          t(
            "character.character-sidebar.tracks-progress-track-status-changed",
            "{{label}} is now {{status}}",
            {
              label: track.label,
              status,
            },
          ),
        );
      })
      .catch(() => {});
  };
  const handleDeleteClick = () => {
    confirm({
      description: t(
        "character.character-sidebar.tracks-progress-track-delete-confirmation",
        "Are you sure you want to delete {{label}}? This action cannot be undone.",
        {
          label: track.label,
        },
      ),
      confirmationText: t("common.delete", "Delete"),
    })
      .then(() => {
        removeProgressTrack({
          gameId,
          id: trackId,
        })
          .then(() => {
            announce(
              t(
                "character.character-sidebar.tracks-progress-track-deleted",
                "{{label}} has been deleted",
                {
                  label: track.label,
                },
              ),
            );
          })
          .catch(() => {});
      })
      .catch(() => {});
  };
  const handleUpdateValue = (value: number) => {
    updateProgressTrack({
      gameId,
      trackId,
      track: {
        ...track,
        value,
      },
    }).catch(() => {});
  };
  const handleSceneChallengeClockChange = (filledSegments: number) => {
    if (track.type === TrackTypes.SceneChallenge) {
      updateProgressTrack({
        gameId,
        trackId,
        track: {
          ...track,
          segmentsFilled: filledSegments,
        },
      })
        .then(() => {
          announce(
            t(
              "character.character-sidebar.tracks-progress-track-status-changed",
              "{{label}} is now {{status}}",
              {
                label: track.label,
                status,
              },
            ),
          );
        })
        .catch(() => {});
    }
  };

  return (
    <>
      <EditOrCreateTrackDialog
        open={isEditDialogOpen}
        handleClose={() => setIsEditDialogOpen(false)}
        initialTrack={{
          trackId,
          track,
        }}
        trackType={track.type}
      />
      <Box display="flex" flexDirection="column" alignItems="flex-start">
        <ProgressTrack
          trackType={getTrackTypeLabel(track.type, t)}
          difficulty={track.difficulty}
          step={difficultySteps[track.difficulty]}
          label={track.label}
          value={track.value}
          description={track.description}
          status={track.status}
          onEditClick={canEdit ? () => setIsEditDialogOpen(true) : undefined}
          onChange={canEdit ? handleUpdateValue : undefined}
        />
        {track.type === TrackTypes.SceneChallenge && (
          <DebouncedClockCircle
            size={"small"}
            segments={4}
            value={track.segmentsFilled}
            voiceLabel={track.label}
            onFilledSegmentsChange={
              canEdit ? handleSceneChallengeClockChange : undefined
            }
            sx={{ mt: 1 }}
          />
        )}
        <Box>
          {canEdit &&
            isCharacterOwner &&
            track.status === TrackStatus.Active && (
              <Box>
                {trackCompletionMoveIds[track.type]?.map((moveId) => (
                  <TrackCompletionMoveButton
                    key={moveId}
                    moveId={moveId}
                    trackType={track.type}
                    trackLabel={track.label}
                    trackProgress={Math.min(track.value / 4)}
                  />
                ))}
              </Box>
            )}
          {canEdit && track.status === TrackStatus.Active && (
            <Button
              variant={"outlined"}
              color={"inherit"}
              onClick={() => handleStatusChange(TrackStatus.Completed)}
              sx={{ mt: 1 }}
              endIcon={<CheckIcon />}
            >
              {t(
                "character.character-sidebar.tracks-progress-track-complete-button",
                "Complete Track",
              )}
            </Button>
          )}
          {canEdit && track.status === TrackStatus.Completed && (
            <Button
              variant={"outlined"}
              color={"inherit"}
              onClick={() => handleStatusChange(TrackStatus.Active)}
              sx={{ mt: 1 }}
            >
              {t(
                "character.character-sidebar.tracks-progress-track-reopen-button",
                "Reopen Track",
              )}
            </Button>
          )}
          {canEdit && track.status === TrackStatus.Completed && (
            <Button color={"error"} sx={{ mt: 1 }} onClick={handleDeleteClick}>
              {t(
                "character.character-sidebar.tracks-progress-track-delete-button",
                "Delete Permanently",
              )}
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
}
