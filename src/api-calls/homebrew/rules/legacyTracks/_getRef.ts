import { firestore } from "config/firebase.config";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
} from "firebase/firestore";

import { HomebrewLegacyTrackDocument } from "api-calls/homebrew/rules/legacyTracks/_homebrewLegacyTrack.type";

export function constructHomebrewLegacyTracksCollectionPath() {
  return `homebrew/homebrew/legacy_tracks`;
}

export function constructHomebrewLegacyTrackDocPath(legacyTrackId: string) {
  return `${constructHomebrewLegacyTracksCollectionPath()}/${legacyTrackId}`;
}

export function getHomebrewLegacyTrackCollection() {
  return collection(
    firestore,
    constructHomebrewLegacyTracksCollectionPath(),
  ) as CollectionReference<HomebrewLegacyTrackDocument>;
}

export function getHomebrewLegacyTrackDoc(legacyTrackId: string) {
  return doc(
    firestore,
    constructHomebrewLegacyTrackDocPath(legacyTrackId),
  ) as DocumentReference<HomebrewLegacyTrackDocument>;
}
