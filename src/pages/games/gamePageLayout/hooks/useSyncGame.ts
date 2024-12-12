import { Unsubscribe } from "firebase/firestore";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { listenToAssets } from "api-calls/assets/listenToAssets";

import { derivedAtomWithEquality } from "atoms/derivedAtomWithEquality";

import { useListenToGame } from "stores/game.store";
import { useListenToGameCharacters } from "stores/gameCharacters.store";

import {
  currentCampaignAtom,
  defaultCurrentCampaignAtom,
  useSetCurrentCampaignAtom,
  useSyncProgressTracks,
} from "../atoms/campaign.atom";
import { useSetCampaignCharacters } from "../atoms/campaign.characters.atom";
import { useListenToLogs } from "../atoms/gameLog.atom";
import { useSyncNotes } from "../atoms/notes.atom";

const charactersAtom = derivedAtomWithEquality(
  currentCampaignAtom,
  (atom) => atom.campaign?.characters ?? [],
);

export function useSyncGame() {
  const { t } = useTranslation();

  const { gameId } = useParams<{ gameId: string }>();

  useListenToGame(gameId);
  useListenToGameCharacters(gameId);

  const setCurrentCampaign = useSetCurrentCampaignAtom();
  const setCurrentCampaignCharacters = useSetCampaignCharacters();

  const campaignCharacters = useAtomValue(charactersAtom);

  useEffect(() => {
    const unsubscribes: Unsubscribe[] = [];
    if (gameId) {
      unsubscribes.push(
        listenToAssets(
          undefined,
          gameId,
          (assets) => {
            setCurrentCampaign((prev) => ({
              ...prev,
              sharedAssets: {
                loading: false,
                assets,
              },
            }));
          },
          (error) => {
            console.error(error);
            setCurrentCampaign((prev) => ({
              ...prev,
              sharedAssets: {
                loading: false,
                assets: {},
                error: "Failed to load assets",
              },
            }));
          },
        ),
      );
    } else {
      setCurrentCampaign(defaultCurrentCampaignAtom);
    }
    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
      setCurrentCampaign(defaultCurrentCampaignAtom);
    };
  }, [gameId, t, setCurrentCampaign]);

  useEffect(() => {
    const unsubscribes: Unsubscribe[] = [];

    campaignCharacters.forEach(({ characterId }) => {
      unsubscribes.push(
        listenToAssets(
          characterId,
          undefined,
          (assets) => {
            setCurrentCampaignCharacters((prev) => ({
              ...prev,
              [characterId]: {
                ...prev[characterId],
                assets: {
                  loading: false,
                  assets,
                },
              },
            }));
          },
          (error) => {
            console.error(error);
            setCurrentCampaignCharacters((prev) => ({
              ...prev,
              [characterId]: {
                ...prev[characterId],
                assets: {
                  loading: false,
                  assets: {},
                  error: "Failed to load assets",
                },
              },
            }));
          },
        ),
      );
    });

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [campaignCharacters, setCurrentCampaignCharacters, t]);

  useEffect(() => {
    return () => {
      setCurrentCampaignCharacters({});
    };
  }, [gameId, setCurrentCampaignCharacters]);

  useListenToLogs();
  useSyncProgressTracks();
  useSyncNotes();
}
