import { useDerivedCampaignState } from "pages/games/gamePageLayout/hooks/useDerivedCampaignState";

import { TrackTypes } from "types/Track.type";

import { TrackClock } from "./TrackClock";
import { TrackProgressTrack } from "./TrackProgressTrack";

export interface TrackItemProps {
  gameId: string;
  canEdit: boolean;
  trackId: string;
}

export function TrackItem(props: TrackItemProps) {
  const { gameId, canEdit, trackId } = props;

  const track = useDerivedCampaignState(
    (state) => state.tracks.tracks[trackId],
  );

  if (!track) {
    return null;
  }

  if (track.type === TrackTypes.Clock) {
    return (
      <TrackClock
        gameId={gameId}
        clockId={trackId}
        clock={track}
        canEdit={canEdit}
      />
    );
  }
  return (
    <TrackProgressTrack
      gameId={gameId}
      trackId={trackId}
      track={track}
      canEdit={canEdit}
    />
  );
}
