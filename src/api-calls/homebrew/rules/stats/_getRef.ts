import {
  CollectionReference,
  DocumentReference,
  collection,
  doc,
} from "firebase/firestore";

import { HomebrewStatDocument } from "api-calls/homebrew/rules/stats/_homebrewStat.type";

import { firestore } from "config/firebase.config";

export function constructHomebrewStatsCollectionPath() {
  return `homebrew/homebrew/stats`;
}

export function constructHomebrewStatsDocPath(statId: string) {
  return `${constructHomebrewStatsCollectionPath()}/${statId}`;
}

export function getHomebrewStatsCollection() {
  return collection(
    firestore,
    constructHomebrewStatsCollectionPath(),
  ) as CollectionReference<HomebrewStatDocument>;
}

export function getHomebrewStatsDoc(statId: string) {
  return doc(
    firestore,
    constructHomebrewStatsDocPath(statId),
  ) as DocumentReference<HomebrewStatDocument>;
}
