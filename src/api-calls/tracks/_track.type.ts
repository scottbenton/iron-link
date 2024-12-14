import { Timestamp } from "firebase/firestore";

import {
  IClock,
  IProgressTrack,
  ISceneChallenge,
} from "services/tracks.service";

export interface ProgressTrackDocument
  extends Omit<IProgressTrack, "createdDate"> {
  createdTimestamp: Timestamp;
}
export interface ClockDocument extends Omit<IClock, "createdDate"> {
  createdTimestamp: Timestamp;
}

export interface SceneChallengeDocument
  extends Omit<ISceneChallenge, "createdDate"> {
  createdTimestamp: Timestamp;
}

export type TrackDocument = ProgressTrackDocument | ClockDocument;
