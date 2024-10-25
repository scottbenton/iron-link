import { firestore } from "config/firebase.config";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  Timestamp,
} from "firebase/firestore";

import { GameLogDocument } from "./_game-log.type";
import { Roll } from "types/DieRolls.type";

export function constructCampaignGameLogCollectionPath(campaignId: string) {
  return `/campaigns/${campaignId}/game-log`;
}

export function constructCampaignGameLogDocPath(
  campaignId: string,
  logId: string,
) {
  return `/campaigns/${campaignId}/game-log/${logId}`;
}

export function getCampaignGameLogCollection(campaignId: string) {
  return collection(
    firestore,
    constructCampaignGameLogCollectionPath(campaignId),
  ) as CollectionReference<GameLogDocument>;
}

export function getCampaignGameLogDocument(campaignId: string, logId: string) {
  return doc(
    firestore,
    constructCampaignGameLogDocPath(campaignId, logId),
  ) as DocumentReference<GameLogDocument>;
}

export function convertFromDatabase(log: GameLogDocument): Roll {
  return {
    ...log,
    timestamp: log.timestamp.toDate(),
  } as Roll;
}

export function convertRollToGameLogDocument(roll: Roll): GameLogDocument {
  return {
    ...roll,
    timestamp: Timestamp.fromDate(roll.timestamp),
  };
}
