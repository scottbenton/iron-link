import { deleteDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";

import { getCampaignTracksDoc } from "./_getRef";

export const removeProgressTrack = createApiFunction<
  {
    gameId: string;
    id: string;
  },
  void
>((params) => {
  const { gameId, id } = params;

  return new Promise((resolve, reject) => {
    if (!gameId) {
      reject(new Error("Either campaign or character ID must be defined."));
      return;
    }

    deleteDoc(getCampaignTracksDoc(gameId, id))
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to remove progress track.");
