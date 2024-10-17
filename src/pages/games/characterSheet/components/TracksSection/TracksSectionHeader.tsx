import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useSetCurrentCampaignAtom } from "pages/games/gamePageLayout/atoms/campaign.atom";
import {
  CampaignPermissionType,
  useCampaignPermissions,
} from "pages/games/gamePageLayout/hooks/usePermissions";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { TrackSectionProgressTracks, TrackTypes } from "types/Track.type";
import { EditOrCreateTrackDialog } from "./EditOrCreateTrackDialog";
import { EditOrCreateClockDialog } from "./EditOrCreateClockDialog";

export interface TracksSectionHeaderProps {
  showCompletedTracks: boolean;
}

export function TracksSectionHeader(props: TracksSectionHeaderProps) {
  const { showCompletedTracks } = props;
  const { t } = useTranslation();

  const setCurrentCampaign = useSetCurrentCampaignAtom();

  const toggleShowCompletedTracks = useCallback(
    (showCompletedTracks: boolean) => {
      setCurrentCampaign((prev) => ({
        ...prev,
        tracks: {
          ...prev.tracks,
          showCompletedTracks,
        },
      }));
    },
    [setCurrentCampaign]
  );

  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const addMenuRef = useRef<HTMLButtonElement | null>(null);

  const [isAddClockDialogOpen, setIsAddClockDialogOpen] = useState(false);
  const [isAddTrackDialogOpen, setIsAddTrackDialogOpen] = useState<{
    trackType: TrackSectionProgressTracks | TrackTypes.SceneChallenge;
    open: boolean;
  }>({
    open: false,
    trackType: TrackTypes.Vow,
  });
  const handleOpenTrack = (
    trackType: TrackSectionProgressTracks | TrackTypes.SceneChallenge
  ) => {
    setIsAddTrackDialogOpen({
      open: true,
      trackType,
    });
    setIsAddMenuOpen(false);
  };

  const isPlayer =
    useCampaignPermissions().campaignPermission !==
    CampaignPermissionType.Viewer;

  return (
    <Box
      mx={-2}
      mt={-2}
      px={2}
      py={1}
      bgcolor={(theme) =>
        theme.palette.mode === "light" ? "grey.300" : "grey.700"
      }
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <FormControlLabel
        label={t(
          "character.character-sidebar.show-completed-tracks",
          "Show Completed"
        )}
        control={
          <Checkbox
            checked={showCompletedTracks}
            onChange={(_, checked) => toggleShowCompletedTracks(checked)}
          />
        }
      />
      {isPlayer && (
        <>
          <Button
            color="inherit"
            variant="outlined"
            ref={addMenuRef}
            onClick={() => setIsAddMenuOpen(true)}
          >
            {t("character.character-sidebar.add-track", "Add Track")}
          </Button>
          <Menu
            open={isAddMenuOpen}
            anchorEl={addMenuRef.current}
            onClose={() => setIsAddMenuOpen(false)}
          >
            <MenuItem onClick={() => handleOpenTrack(TrackTypes.Vow)}>
              <ListItemText
                primary={t("character.character-sidebar.add-vow", "Vow")}
              />
            </MenuItem>
            <MenuItem onClick={() => handleOpenTrack(TrackTypes.Fray)}>
              <ListItemText
                primary={t(
                  "character.character-sidebar.add-combat-track",
                  "Combat Track"
                )}
              />
            </MenuItem>
            <MenuItem onClick={() => handleOpenTrack(TrackTypes.Journey)}>
              <ListItemText
                primary={t(
                  "character.character-sidebar.add-journey",
                  "Journey"
                )}
              />
            </MenuItem>
            <MenuItem
              onClick={() => handleOpenTrack(TrackTypes.SceneChallenge)}
            >
              <ListItemText
                primary={t(
                  "character.character-sidebar.add-scene-challenge",
                  "Scene Challenge"
                )}
              />
            </MenuItem>
            <MenuItem
              onClick={() => {
                setIsAddClockDialogOpen(true);
                setIsAddMenuOpen(false);
              }}
            >
              <ListItemText
                primary={t("character.character-sidebar.add-clock", "Clock")}
              />
            </MenuItem>
          </Menu>
        </>
      )}
      <EditOrCreateTrackDialog
        open={isAddTrackDialogOpen.open}
        handleClose={() =>
          setIsAddTrackDialogOpen((prev) => ({ ...prev, open: false }))
        }
        trackType={isAddTrackDialogOpen.trackType}
      />
      <EditOrCreateClockDialog
        open={isAddClockDialogOpen}
        handleClose={() => setIsAddClockDialogOpen(false)}
      />
    </Box>
  );
}
