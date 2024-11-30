import { addDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";
import { HomebrewLegacyTrackDocument } from "api-calls/homebrew/rules/legacyTracks/_homebrewLegacyTrack.type";

import { getHomebrewLegacyTrackCollection } from "./_getRef";

export const createHomebrewLegacyTrack = createApiFunction<
  {
    legacyTrack: HomebrewLegacyTrackDocument;
  },
  void
>((params) => {
  const { legacyTrack } = params;
  return new Promise((resolve, reject) => {
    addDoc(getHomebrewLegacyTrackCollection(), legacyTrack)
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
}, "Failed to create legacy track.");
