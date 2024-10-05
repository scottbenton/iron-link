import { useDataswornTreeSetter } from "atoms/dataswornTree.atom";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  currentCampaignAtom,
  useSetCurrentCampaignAtom,
} from "../atoms/campaign.atom";
import { Unsubscribe } from "firebase/firestore";
import { listenToCampaign } from "api-calls/campaign/listenToCampaign";
import { useTranslation } from "react-i18next";
import { Datasworn } from "@datasworn/core";
import {
  defaultBaseRulesets,
  defaultExpansions,
} from "data/datasworn.packages";
import { derivedAtomWithEquality } from "atoms/derivedAtomWithEquality";
import { useAtomValue } from "jotai";
import { listenToCharacter } from "api-calls/character/listenToCharacter";
import { useSetCampaignCharacters } from "../atoms/campaign.characters.atom";

const expansionsAndRulesetsAtom = derivedAtomWithEquality(
  currentCampaignAtom,
  (atom) => ({
    rulesets: atom.campaign?.rulesets ?? {},
    expansions: atom.campaign?.expansions ?? {},
  })
);

const charactersAtom = derivedAtomWithEquality(
  currentCampaignAtom,
  (atom) => atom.campaign?.characters ?? []
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
    let unsubscribe: Unsubscribe | undefined = undefined;
    if (campaignId) {
      unsubscribe = listenToCampaign(
        campaignId,
        (campaign) => {
          setCurrentCampaign({ campaignId, campaign, loading: false });
        },
        (error) => {
          console.error(error);
          setCurrentCampaign({
            campaignId,
            campaign: null,
            loading: false,
            error: t("game.load-failure", "Error loading game"),
          });
        }
      );
    } else {
      setCurrentCampaign({
        campaignId: "",
        campaign: null,
        loading: false,
      });
    }
    return () => {
      unsubscribe?.();
      setCurrentCampaign({
        campaignId: "",
        campaign: null,
        loading: true,
      });
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
      const unsubscribe = listenToCharacter(
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
        }
      );
      unsubscribes.push(unsubscribe);
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
}
