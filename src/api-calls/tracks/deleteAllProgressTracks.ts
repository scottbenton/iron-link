import { getDocs } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";
import { getCampaignTracksCollection } from "api-calls/tracks/_getRef";
import { removeProgressTrack } from "api-calls/tracks/removeProgressTrack";

function getAllProgressTracks(gameId: string): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    getDocs(getCampaignTracksCollection(gameId))
      .then((snapshot) => {
        const ids = snapshot.docs.map((doc) => doc.id);
        resolve(ids);
      })
      .catch(() => {
        reject("Failed to get tracks.");
      });
  });
}

export const deleteAllProgressTracks = createApiFunction<
  { gameId: string },
  void
>(({ gameId }) => {
  return new Promise<void>((resolve, reject) => {
    getAllProgressTracks(gameId)
      .then((trackIds) => {
        const promises = trackIds.map((trackId) =>
          removeProgressTrack({ gameId, id: trackId }),
        );
        Promise.all(promises)
          .then(() => {
            resolve();
          })
          .catch((e) => {
            reject(e);
          });
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to delete some or all tracks.");
