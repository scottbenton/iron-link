import { addDoc } from "firebase/firestore";

import { Track } from "types/Track.type";

import { createApiFunction } from "api-calls/createApiFunction";

import { convertToDatabase, getCampaignTracksCollection } from "./_getRef";

export const addProgressTrack = createApiFunction<
  {
    gameId: string;
    track: Track;
  },
  void
>((params) => {
  const { gameId, track } = params;

  const storedTrack = convertToDatabase(track);

  return new Promise((resolve, reject) => {
    addDoc(getCampaignTracksCollection(gameId), storedTrack)
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to add progress track.");
