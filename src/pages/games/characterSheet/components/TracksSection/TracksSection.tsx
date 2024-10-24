import { Box, LinearProgress } from "@mui/material";

import { TrackItem } from "pages/games/characterSheet/components/TracksSection/TrackItem";
import { TracksSectionHeader } from "pages/games/characterSheet/components/TracksSection/TracksSectionHeader";
import { useCampaignId } from "pages/games/gamePageLayout/hooks/useCampaignId";
import { useDerivedCampaignState } from "pages/games/gamePageLayout/hooks/useDerivedCampaignState";
import {
  CampaignPermissionType,
  useCampaignPermissions,
} from "pages/games/gamePageLayout/hooks/usePermissions";

export function TracksSection() {
  const campaignId = useCampaignId();

  const showCompletedTracks = useDerivedCampaignState(
    (state) => state.tracks.showCompletedTracks,
  );
  const areTracksLoading = useDerivedCampaignState(
    (state) => state.tracks.loading,
  );
  const sortedTrackIds = useDerivedCampaignState((state) =>
    Object.keys(state.tracks.tracks).sort((a, b) => {
      const tA = state.tracks.tracks[a];
      const tB = state.tracks.tracks[b];
      return tB.createdDate.getTime() - tA.createdDate.getTime();
    }),
  );

  const canEdit =
    useCampaignPermissions().campaignPermission !==
    CampaignPermissionType.Viewer;

  return (
    <>
      <TracksSectionHeader showCompletedTracks={showCompletedTracks} />
      {areTracksLoading && <LinearProgress />}
      <Box
        display="flex"
        flexDirection="column"
        pt={2}
        gap={4}
        alignItems="flex-start"
      >
        {sortedTrackIds.map((trackId) => (
          <TrackItem
            key={trackId}
            gameId={campaignId}
            canEdit={canEdit}
            trackId={trackId}
          />
        ))}
      </Box>
    </>
  );
}
