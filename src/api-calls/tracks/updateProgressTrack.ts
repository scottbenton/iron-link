import { updateDoc } from "firebase/firestore";
import { getCampaignTracksDoc } from "./_getRef";
import { Track } from "types/Track.type";
import { createApiFunction } from "api-calls/createApiFunction";

export const updateProgressTrack = createApiFunction<
  {
    gameId: string;
    trackId: string;
    track: Partial<Track>;
  },
  void
>((params) => {
  const { gameId, trackId, track } = params;
  return new Promise((resolve, reject) => {
    updateDoc(getCampaignTracksDoc(gameId, trackId), track)
      .then(() => {
        resolve();
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to update progress track");
      });
  });
}, "Failed to update progress track.");
