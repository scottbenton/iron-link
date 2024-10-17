import {
  Alert,
  AlertTitle,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { addProgressTrack } from "api-calls/tracks/addProgressTrack";
import { updateProgressTrack } from "api-calls/tracks/updateProgressTrack";
import { TFunction } from "i18next";
import { useCampaignId } from "pages/games/gamePageLayout/hooks/useCampaignId";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ProgressTrack,
  Difficulty,
  TrackStatus,
  TrackSectionProgressTracks,
  TrackTypes,
  SceneChallenge,
} from "types/Track.type";

export interface EditOrCreateTrackDialogProps {
  open: boolean;
  handleClose: () => void;
  initialTrack?: { trackId: string; track: SceneChallenge | ProgressTrack };
  trackType: TrackSectionProgressTracks | TrackTypes.SceneChallenge;
}

export function EditOrCreateTrackDialog(props: EditOrCreateTrackDialogProps) {
  const { open, handleClose, initialTrack, trackType } = props;
  const { t } = useTranslation();

  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const [track, setTrack] = useState<Partial<ProgressTrack | SceneChallenge>>(
    initialTrack?.track ?? { type: trackType }
  );
  const [resetProgress, setResetProgress] = useState(false);

  const campaignId = useCampaignId();

  useEffect(() => {
    setTrack(initialTrack?.track ?? { type: trackType });
  }, [initialTrack, trackType]);

  const handleDialogClose = () => {
    setTrack({});
    setError(undefined);
    setLoading(false);
    handleClose();
  };

  const handleSubmit = () => {
    const potentialError = verifyTrack(track, t);
    if (potentialError) {
      setError(potentialError);
      return;
    }

    let trackDocument: ProgressTrack | SceneChallenge;
    if (trackType === TrackTypes.SceneChallenge) {
      trackDocument = {
        createdDate: initialTrack?.track.createdDate ?? new Date(),
        status: TrackStatus.Active,
        type: TrackTypes.SceneChallenge,
        label: track.label ?? "",
        description: track.description ?? "",
        difficulty: track.difficulty ?? Difficulty.Troublesome,
        value:
          initialTrack?.track.value && !resetProgress
            ? initialTrack.track.value
            : 0,
        segmentsFilled:
          (initialTrack?.track as SceneChallenge).segmentsFilled ?? 0,
      };
    } else {
      trackDocument = {
        createdDate: initialTrack?.track.createdDate ?? new Date(),
        status: TrackStatus.Active,
        type: trackType || TrackTypes.Vow,
        label: track.label ?? "",
        description: track.description ?? "",
        difficulty:
          (track as ProgressTrack).difficulty ?? Difficulty.Troublesome,
        value:
          initialTrack?.track.value && !resetProgress
            ? initialTrack.track.value
            : 0,
      };
    }
    setLoading(true);
    if (initialTrack) {
      updateProgressTrack({
        gameId: campaignId,
        trackId: initialTrack.trackId,
        track: trackDocument,
      })
        .then(() => {
          handleDialogClose();
        })
        .catch(() => {
          setLoading(false);
          setError(
            t(
              "character.character-sidebar.track-update-error",
              "Error updating track"
            )
          );
        });
    } else {
      addProgressTrack({ gameId: campaignId, track: trackDocument })
        .then(() => {
          handleDialogClose();
        })
        .catch(() => {
          setLoading(false);
          setError(
            t(
              "character.character-sidebar.track-add-error",
              "Error adding track"
            )
          );
        });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleDialogClose} maxWidth={"xs"} fullWidth>
        <DialogTitle>
          {initialTrack
            ? t("character.character-sidebar.track-edit-title", "Edit Track")
            : t("character.character-sidebar.track-add-title", "Add Track")}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {error && (
              <Alert severity="error">
                <AlertTitle>{t("common.error", "Error")}</AlertTitle>
                {error}
              </Alert>
            )}
            <TextField
              label={t(
                "character.character-sidebar.track-title-input",
                "Title"
              )}
              required
              value={track.label ?? ""}
              onChange={(evt) =>
                setTrack((prev) => ({ ...prev, label: evt.target.value }))
              }
              sx={{ mt: 1 }}
            />
            <TextField
              label={t(
                "character.character-sidebar.track-description-input",
                "Description"
              )}
              value={track.description ?? ""}
              onChange={(evt) =>
                setTrack((prev) => ({ ...prev, description: evt.target.value }))
              }
              multiline
              minRows={3}
            />
            <TextField
              label={t(
                "character.character-sidebar.track-difficulty-input",
                "Difficulty"
              )}
              value={track.difficulty ?? "-1"}
              onChange={(evt) =>
                setTrack((prev) => ({
                  ...prev,
                  difficulty: evt.target.value as Difficulty,
                }))
              }
              multiline
              required
              select
            >
              <MenuItem value={"-1"} disabled></MenuItem>

              <MenuItem value={Difficulty.Troublesome}>
                {t(
                  "datasworn.progress-tracks.difficulty-troublesome",
                  "Troublesome"
                )}
              </MenuItem>
              <MenuItem value={Difficulty.Dangerous}>
                {t(
                  "datasworn.progress-tracks.difficulty-dangerous",
                  "Dangerous"
                )}
              </MenuItem>
              <MenuItem value={Difficulty.Formidable}>
                {t(
                  "datasworn.progress-tracks.difficulty-formidable",
                  "Formidable"
                )}
              </MenuItem>
              <MenuItem value={Difficulty.Extreme}>
                {t("datasworn.progress-tracks.difficulty-extreme", "Extreme")}
              </MenuItem>
              <MenuItem value={Difficulty.Epic}>
                {t("datasworn.progress-tracks.difficulty-epic", "Epic")}
              </MenuItem>
            </TextField>
            {initialTrack &&
              initialTrack.track.difficulty !== track.difficulty && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={resetProgress}
                      onChange={(_, value) => setResetProgress(value)}
                    />
                  }
                  label={"Reset Track Progress"}
                  sx={{ textTransform: "capitalize", marginRight: 3 }}
                />
              )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={loading}
            onClick={() => handleDialogClose()}
            color={"inherit"}
          >
            Cancel
          </Button>
          <Button
            disabled={loading}
            onClick={() => handleSubmit()}
            variant={"contained"}
          >
            {initialTrack
              ? t("character.character-sidebar.edit-track-button", "Edit Track")
              : t("character.character-sidebar.add-track-button", "Add Track")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function verifyTrack(
  track: Partial<ProgressTrack | SceneChallenge>,
  t: TFunction
): string | undefined {
  // track.type === TrackTypes.Clock && track.
  if (!track.label) {
    return t(
      "character.character-sidebar.track-label-required-error",
      "Label is required"
    );
  } else if (!(track as ProgressTrack).difficulty) {
    return t(
      "character.character-sidebar.track-difficulty-required-error",
      "Difficulty is required"
    );
  }
}
