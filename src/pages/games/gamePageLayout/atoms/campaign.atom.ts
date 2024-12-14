import { atom, useSetAtom } from "jotai";
import { useCallback, useEffect } from "react";

import { AssetDocument } from "api-calls/assets/_asset.type";
import { CampaignDocument } from "api-calls/campaign/_campaign.type";
import { listenToProgressTracks } from "api-calls/tracks/listenToProgressTracks";

import { TrackStatus } from "repositories/tracks.repository";

import { ITrack } from "services/tracks.service";

import { useDerivedCampaignState } from "../hooks/useDerivedCampaignState";
import { useGameId } from "../hooks/useGameId";

export interface ICurrentCampaignAtom {
  campaignId: string;
  campaign: CampaignDocument | null;
  loading: boolean;
  error?: string;
  sharedAssets: {
    loading: boolean;
    assets: Record<string, AssetDocument>;
    error?: string;
  };
  tracks: {
    loading: boolean;
    tracks: Record<string, ITrack>;
    showCompletedTracks: boolean;
    error?: string;
  };
}

export const defaultCurrentCampaignAtom: ICurrentCampaignAtom = {
  campaignId: "",
  campaign: null,
  loading: true,
  sharedAssets: {
    loading: true,
    assets: {},
  },
  tracks: {
    loading: true,
    showCompletedTracks: false,
    tracks: {},
  },
};

export const currentCampaignAtom = atom<ICurrentCampaignAtom>(
  defaultCurrentCampaignAtom,
);

export function useSetCurrentCampaignAtom() {
  return useSetAtom(currentCampaignAtom);
}

export function useSyncProgressTracks() {
  const campaignId = useGameId();
  const showCompletedTracks = useDerivedCampaignState(
    (state) => state.tracks.showCompletedTracks,
  );
  const setCurrentCampaign = useSetCurrentCampaignAtom();

  const handleListenToTracks = useCallback(
    (status: TrackStatus) => {
      return listenToProgressTracks(
        campaignId,
        status,
        (tracks) => {
          setCurrentCampaign((prev) => ({
            ...prev,
            tracks: {
              showCompletedTracks: prev.tracks.showCompletedTracks,
              loading: false,
              tracks: {
                ...prev.tracks.tracks,
                ...tracks,
              },
            },
          }));
        },
        (trackId) => {
          setCurrentCampaign((prev) => {
            const newTracks = { ...prev.tracks.tracks };
            // Don't delete it if its been reopened
            if (
              newTracks[trackId].status === status ||
              (!prev.tracks.showCompletedTracks &&
                status === TrackStatus.Completed)
            ) {
              delete newTracks[trackId];
            }
            return {
              ...prev,
              tracks: {
                showCompletedTracks: prev.tracks.showCompletedTracks,
                loading: false,
                tracks: newTracks,
              },
            };
          });
        },
        (error) => {
          console.error(error);
          setCurrentCampaign((prev) => ({
            ...prev,
            tracks: {
              showCompletedTracks: prev.tracks.showCompletedTracks,
              loading: false,
              error: "Failed to load tracks",
              tracks: {},
            },
          }));
        },
      );
    },
    [campaignId, setCurrentCampaign],
  );

  useEffect(() => {
    const unsubscribe = handleListenToTracks(TrackStatus.Active);

    return () => {
      unsubscribe?.();
    };
  }, [handleListenToTracks]);

  useEffect(() => {
    if (showCompletedTracks) {
      const unsubscribe = handleListenToTracks(TrackStatus.Completed);

      return () => {
        unsubscribe?.();
      };
    }
  }, [showCompletedTracks, handleListenToTracks]);
}
