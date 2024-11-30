import {
  CollectionReference,
  DocumentReference,
  collection,
  doc,
} from "firebase/firestore";

import { CampaignDocument } from "api-calls/campaign/_campaign.type";

import { firestore } from "config/firebase.config";

export function constructCampaignCollectionPath() {
  return `/campaigns`;
}
export function constructCampaignDocPath(campaignId: string) {
  return `/campaigns/${campaignId}`;
}

export function getCampaignCollection() {
  return collection(
    firestore,
    constructCampaignCollectionPath(),
  ) as CollectionReference<CampaignDocument>;
}

export function getCampaignDoc(campaignId: string) {
  return doc(
    firestore,
    constructCampaignDocPath(campaignId),
  ) as DocumentReference<CampaignDocument>;
}
