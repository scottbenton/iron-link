import { TrackTypes } from "repositories/tracks.repository";

export enum RollResult {
  StrongHit = "strong_hit",
  WeakHit = "weak_hit",
  Miss = "miss",
}

export enum RollType {
  Stat = "stat",
  OracleTable = "oracle_table",
  TrackProgress = "track_progress",
  SpecialTrackProgress = "special_track_progress",
  ClockProgression = "clock_progression",
}

export interface BaseRoll {
  type: RollType;
  rollLabel: string;
  timestamp: Date;
  characterId: string | null;
  uid: string;
  gmsOnly: boolean;
}
export interface StatRoll extends BaseRoll {
  type: RollType.Stat;
  moveId: string | null;
  rolled: string;
  action: number;
  actionTotal: number;
  challenge1: number;
  challenge2: number;
  modifier: number;
  matchedNegativeMomentum: boolean;
  adds: number;
  result: RollResult;
  momentumBurned: number | null;
}

export interface OracleTableRoll extends BaseRoll {
  type: RollType.OracleTable;
  roll: number | number[];
  result: string;
  oracleCategoryName?: string;
  oracleId?: string;
  match?: boolean;
}

export interface TrackProgressRoll extends BaseRoll {
  type: RollType.TrackProgress;
  challenge1: number;
  challenge2: number;
  trackProgress: number;
  result: RollResult;
  trackType: TrackTypes;
  moveId?: string;
}

export interface SpecialTrackProgressRoll extends BaseRoll {
  type: RollType.SpecialTrackProgress;
  challenge1: number;
  challenge2: number;
  trackProgress: number;
  result: RollResult;
  specialTrackKey: string;
  moveId?: string;
}

export interface ClockProgressionRoll extends BaseRoll {
  type: RollType.ClockProgression;
  roll: number;
  oracleTitle: string;
  result: string;
  oracleId?: string;
  match?: boolean;
}

export type Roll =
  | StatRoll
  | OracleTableRoll
  | TrackProgressRoll
  | ClockProgressionRoll
  | SpecialTrackProgressRoll;
