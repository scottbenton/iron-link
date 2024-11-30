import { Datasworn } from "@datasworn/core";
import { Unsubscribe } from "firebase/firestore";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { listenToAssets } from "api-calls/assets/listenToAssets";
import { listenToCampaign } from "api-calls/campaign/listenToCampaign";
import { listenToCharacter } from "api-calls/character/listenToCharacter";

import { useDataswornTreeSetter } from "atoms/dataswornTree.atom";
import { derivedAtomWithEquality } from "atoms/derivedAtomWithEquality";

import {
  defaultBaseRulesets,
  defaultExpansions,
} from "data/datasworn.packages";

import {
  currentCampaignAtom,
  defaultCurrentCampaignAtom,
  useSetCurrentCampaignAtom,
  useSyncProgressTracks,
} from "../atoms/campaign.atom";
import { useSetCampaignCharacters } from "../atoms/campaign.characters.atom";
import { useListenToLogs } from "../atoms/gameLog.atom";
import { useSyncNotes } from "../atoms/notes.atom";

const expansionsAndRulesetsAtom = derivedAtomWithEquality(
  currentCampaignAtom,
  (atom) => ({
    rulesets: atom.campaign?.rulesets ?? {},
    expansions: atom.campaign?.expansions ?? {},
  }),
);

const charactersAtom = derivedAtomWithEquality(
  currentCampaignAtom,
  (atom) => atom.campaign?.characters ?? [],
);

export function useSyncCampaign() {
  const { t } = useTranslation();

  const { campaignId } = useParams<{ campaignId: string }>();
  const setCurrentCampaign = useSetCurrentCampaignAtom();
  const setCurrentCampaignCharacters = useSetCampaignCharacters();

  const setDataswornTree = useDataswornTreeSetter();

  const campaignRulesPackages = useAtomValue(expansionsAndRulesetsAtom);
  const campaignCharacters = useAtomValue(charactersAtom);

  useEffect(() => {
    const unsubscribes: Unsubscribe[] = [];
    if (campaignId) {
      unsubscribes.push(
        listenToCampaign(
          campaignId,
          (campaign) => {
            setCurrentCampaign((prev) => ({
              ...prev,
              campaignId,
              campaign,
              loading: false,
            }));
          },
          (error) => {
            console.error(error);
            setCurrentCampaign((prev) => ({
              ...prev,
              campaignId,
              campaign: null,
              loading: false,
              error: t("game.load-failure", "Error loading game"),
            }));
          },
        ),
      );
      unsubscribes.push(
        listenToAssets(
          undefined,
          campaignId,
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
  }, [campaignId, t, setCurrentCampaign]);

  useEffect(() => {
    // Set rules packages
    const dataswornTree: Record<string, Datasworn.RulesPackage> = {};
    Object.entries(campaignRulesPackages.rulesets)
      .filter(([, value]) => value)
      .forEach(([key]) => {
        dataswornTree[key] = defaultBaseRulesets[key];
        Object.entries(campaignRulesPackages.expansions[key] ?? {})
          .filter(([, value]) => value)
          .forEach(([expansionId]) => {
            dataswornTree[expansionId] = defaultExpansions[key]?.[expansionId];
          });
      });
    setDataswornTree(dataswornTree);

    return () => {
      setDataswornTree({});
    };
  }, [campaignRulesPackages, setDataswornTree]);

  useEffect(() => {
    const unsubscribes: Unsubscribe[] = [];

    campaignCharacters.forEach(({ characterId }) => {
      unsubscribes.push(
        listenToCharacter(
          characterId,
          (character) => {
            setCurrentCampaignCharacters((characters) => ({
              ...characters,
              [characterId]: {
                ...characters[characterId],
                characterDocument: {
                  data: character,
                  loading: false,
                  error: undefined,
                },
              },
            }));
          },
          (error) => {
            console.error(error);
            setCurrentCampaignCharacters((characters) => ({
              ...characters,
              [characterId]: {
                ...characters[characterId],
                characterDocument: {
                  ...characters[characterId].characterDocument,
                  loading: false,
                  error: t("character.load-failure", "Error loading character"),
                },
              },
            }));
          },
        ),
      );
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
  }, [campaignId, setCurrentCampaignCharacters]);

  useListenToLogs();
  useSyncProgressTracks();
  useSyncNotes();
}
