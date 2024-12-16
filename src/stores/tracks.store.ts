import deepEqual from "fast-deep-equal";
import { useEffect } from "react";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { AskTheOracle, TrackStatus } from "repositories/tracks.repository";

import { ITrack, TracksService } from "services/tracks.service";

interface TracksStoreState {
  tracks: Record<string, ITrack>;
  loading: boolean;
  error?: string;
  showCompletedTracks: boolean;
}

interface TracksStoreActions {
  listenToTracks: (gameId: string) => () => void;
  setShowCompletedTracks: (showCompletedTracks: boolean) => void;

  addTrack: (gameId: string, track: ITrack) => Promise<string>;
  setTrack: (gameId: string, trackId: string, track: ITrack) => Promise<void>;
  updateTrackStatus: (
    gameId: string,
    trackId: string,
    status: TrackStatus,
  ) => Promise<void>;
  updateTrackValue: (
    gameId: string,
    trackId: string,
    value: number,
  ) => Promise<void>;
  updateSceneChallengeClockFilledSegments: (
    gameId: string,
    trackId: string,
    filledSegments: number,
  ) => Promise<void>;
  updateClockSelectedOracle: (
    gameId: string,
    trackId: string,
    oracleKey: AskTheOracle,
  ) => Promise<void>;

  deleteTrack: (gameId: string, trackId: string) => Promise<void>;

  resetStore: () => void;
}

const defaultTracksStoreState: TracksStoreState = {
  tracks: {},
  loading: true,
  showCompletedTracks: false,
};

export const useTracksStore = createWithEqualityFn<
  TracksStoreState & TracksStoreActions
>()(
  immer((set) => ({
    ...defaultTracksStoreState,
    listenToTracks: (gameId: string) => {
      return TracksService.listenToGameTracks(
        gameId,
        (changedTracks, deletedTrackIds) => {
          set((state) => {
            state.loading = false;
            state.tracks = {
              ...state.tracks,
              ...changedTracks,
            };

            deletedTrackIds.forEach((trackId) => {
              delete state.tracks[trackId];
            });
          });
        },
        (error) => {
          set((state) => {
            state.error = error.message;
          });
        },
      );
    },
    setShowCompletedTracks: (showCompletedTracks) => {
      set((state) => {
        state.showCompletedTracks = showCompletedTracks;
      });
    },

    addTrack: (gameId, track) => {
      return TracksService.createTrack(gameId, track);
    },
    setTrack: (gameId, trackId, track) => {
      return TracksService.setTrack(gameId, trackId, track);
    },
    updateTrackStatus: (gameId, trackId, status) => {
      return TracksService.setTrackStatus(gameId, trackId, status);
    },
    updateTrackValue: (gameId, trackId, value) => {
      return TracksService.updateTrackValue(gameId, trackId, value);
    },
    updateSceneChallengeClockFilledSegments: (
      gameId,
      trackId,
      filledSegments,
    ) => {
      return TracksService.updateSceneChallengeClockFilledSegments(
        gameId,
        trackId,
        filledSegments,
      );
    },
    updateClockSelectedOracle: (gameId, trackId, oracleKey) => {
      return TracksService.updateClockSelectedOracle(
        gameId,
        trackId,
        oracleKey,
      );
    },

    deleteTrack: (gameId, trackId) => {
      return TracksService.deleteTrack(gameId, trackId);
    },

    resetStore: () => {
      set((store) => ({
        ...store,
        ...defaultTracksStoreState,
      }));
    },
  })),
  deepEqual,
);

export function useListenToTracks(gameId: string | undefined) {
  const listenToTracks = useTracksStore((store) => store.listenToTracks);
  const resetStore = useTracksStore((store) => store.resetStore);
  useEffect(() => {
    if (gameId) {
      const unsubscribe = listenToTracks(gameId);
      return () => {
        resetStore();
        unsubscribe();
      };
    }
  }, [listenToTracks, gameId, resetStore]);
}
