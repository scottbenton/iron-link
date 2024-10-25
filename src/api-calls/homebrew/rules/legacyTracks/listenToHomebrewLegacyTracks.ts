import { createHomebrewListenerFunction } from "api-calls/homebrew/homebrewListenerFunction";
import { getHomebrewLegacyTrackCollection } from "api-calls/homebrew/rules/legacyTracks/_getRef";

export const listenToHomebrewLegacyTracks = createHomebrewListenerFunction(
  getHomebrewLegacyTrackCollection(),
);
