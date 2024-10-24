import { deleteDoc } from "firebase/firestore";

import { getHomebrewLegacyTrackDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const deleteHomebrewLegacyTrack = createApiFunction<
  {
    legacyTrackId: string;
  },
  void
>((params) => {
  const { legacyTrackId } = params;
  return new Promise((resolve, reject) => {
    deleteDoc(getHomebrewLegacyTrackDoc(legacyTrackId))
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
}, "Failed to delete legacy track.");
