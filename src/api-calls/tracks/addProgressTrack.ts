import { addDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";

import { ITrack } from "services/tracks.service";

import { convertToDatabase, getCampaignTracksCollection } from "./_getRef";

export const addProgressTrack = createApiFunction<
  {
    gameId: string;
    track: ITrack;
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
