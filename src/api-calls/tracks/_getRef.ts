import {
  CollectionReference,
  DocumentReference,
  Timestamp,
  collection,
  doc,
} from "firebase/firestore";

import { firestore } from "config/firebase.config";

import { ITrack } from "services/tracks.service";

import { TrackDocument } from "./_track.type";

export function constructCampaignTracksCollection(campaignId: string) {
  return `/campaigns/${campaignId}/tracks`;
}
export function constructCampaignTracksDocPath(
  campaignId: string,
  trackId: string,
) {
  return `/campaigns/${campaignId}/tracks/${trackId}`;
}

export function getCampaignTracksCollection(campaignId: string) {
  return collection(
    firestore,
    constructCampaignTracksCollection(campaignId),
  ) as CollectionReference<TrackDocument>;
}
export function getCampaignTracksDoc(campaignId: string, trackId: string) {
  return doc(
    firestore,
    constructCampaignTracksDocPath(campaignId, trackId),
  ) as DocumentReference<TrackDocument>;
}

export function convertToDatabase(track: ITrack): TrackDocument {
  const { createdDate, ...rest } = track;

  return {
    ...rest,
    createdTimestamp: Timestamp.fromDate(createdDate),
  } as TrackDocument;
}

export function convertFromDatabase(track: TrackDocument): ITrack {
  const { createdTimestamp, ...rest } = track;

  return {
    ...rest,
    createdDate: createdTimestamp.toDate(),
  };
}
