import { Box, LinearProgress } from "@mui/material";

import { useDerivedCampaignState } from "pages/games/gamePageLayout/hooks/useDerivedCampaignState";
import { useGameId } from "pages/games/gamePageLayout/hooks/useGameId";
import { useCampaignPermissions } from "pages/games/gamePageLayout/hooks/usePermissions";

import { GamePermission } from "stores/game.store";

import { TrackItem } from "./TrackItem";
import { TracksSectionHeader } from "./TracksSectionHeader";

export function TracksSection() {
  const campaignId = useGameId();

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
    useCampaignPermissions().gamePermission !== GamePermission.Viewer;

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
