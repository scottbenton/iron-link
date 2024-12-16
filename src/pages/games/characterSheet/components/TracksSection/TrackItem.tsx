import { useTracksStore } from "stores/tracks.store";

import { TrackTypes } from "repositories/tracks.repository";

import { TrackClock } from "./TrackClock";
import { TrackProgressTrack } from "./TrackProgressTrack";

export interface TrackItemProps {
  gameId: string;
  canEdit: boolean;
  trackId: string;
}

export function TrackItem(props: TrackItemProps) {
  const { gameId, canEdit, trackId } = props;

  const track = useTracksStore((store) => store.tracks[trackId]);

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
