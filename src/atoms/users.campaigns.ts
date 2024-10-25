import { useEffect } from "react";
import { Unsubscribe } from "firebase/firestore";
import { t } from "i18next";
import { atom, useAtom, useAtomValue } from "jotai";

import { useCurrentUserUID } from "./auth.atom";
import { CampaignDocument } from "api-calls/campaign/_campaign.type";
import { listenToUsersCampaigns } from "api-calls/campaign/listenToUsersCampaigns";
import { CharacterDocument } from "api-calls/character/_character.type";
import { getCharacter } from "api-calls/character/getCharacter";
import { getErrorMessage } from "lib/getErrorMessage";

interface CampaignCharacterPortraitSettingsEntry {
  shouldLoad: boolean;
  name?: string;
  settings?: CharacterDocument["profileImage"];
}

export const usersCampaignsAtom = atom<{
  campaigns: Record<string, CampaignDocument>;
  campaignCharacterPortraitSettings: Record<
    string,
    CampaignCharacterPortraitSettingsEntry
  >;
  loading: boolean;
  error?: string;
}>({
  campaigns: {},
  campaignCharacterPortraitSettings: {},
  loading: true,
});

export function useUsersCampaigns() {
  return useAtomValue(usersCampaignsAtom);
}

export function useSyncUsersCampaigns() {
  const uid = useCurrentUserUID();
  const [campaigns, setUsersCampaigns] = useAtom(usersCampaignsAtom);
  const { campaignCharacterPortraitSettings } = campaigns;

  useEffect(() => {
    let unsubscribe: Unsubscribe | undefined = undefined;

    if (uid) {
      unsubscribe = listenToUsersCampaigns(
        uid,
        {
          onDocChange: (id, campaign) => {
            const newCampaignCharacterPortraitSettings: Record<
              string,
              CampaignCharacterPortraitSettingsEntry
            > = {};
            campaign.characters.forEach((character) => {
              newCampaignCharacterPortraitSettings[character.characterId] = {
                shouldLoad: true,
                settings: undefined,
              };
            });
            setUsersCampaigns((prev) => ({
              campaignCharacterPortraitSettings: {
                ...newCampaignCharacterPortraitSettings,
                ...prev.campaignCharacterPortraitSettings,
              },
              campaigns: {
                ...prev.campaigns,
                [id]: campaign,
              },
              loading: false,
              error: undefined,
            }));
          },
          onDocRemove: (id) => {
            setUsersCampaigns((prev) => {
              const newCampaigns = { ...prev.campaigns };
              delete newCampaigns[id];
              return {
                ...prev,
                campaigns: newCampaigns,
                loading: false,
                error: undefined,
              };
            });
          },
          onLoaded: () => {
            setUsersCampaigns((prev) => ({
              ...prev,
              loading: false,
              error: undefined,
            }));
          },
        },
        (error) => {
          const errorMessage = getErrorMessage(
            error,
            t("game.list.load-failure", "Failed to load games"),
          );
          setUsersCampaigns((prev) => ({
            ...prev,
            loading: false,
            error: errorMessage,
          }));
        },
      );
    }

    return () => {
      unsubscribe?.();
    };
  }, [setUsersCampaigns, uid]);

  useEffect(() => {
    Object.entries(campaignCharacterPortraitSettings).forEach(
      ([characterId, settingsConfig]) => {
        if (settingsConfig.shouldLoad) {
          setUsersCampaigns((prev) => ({
            ...prev,
            campaignCharacterPortraitSettings: {
              ...prev.campaignCharacterPortraitSettings,
              [characterId]: {
                shouldLoad: false,
                name: undefined,
                settings: undefined,
              },
            },
          }));

          getCharacter(characterId).then((character) => {
            setUsersCampaigns((prev) => ({
              ...prev,
              campaignCharacterPortraitSettings: {
                ...prev.campaignCharacterPortraitSettings,
                [characterId]: {
                  shouldLoad: false,
                  name: character.name,
                  settings: character.profileImage ?? undefined,
                },
              },
            }));
          });
        }
      },
    );
  }, [setUsersCampaigns, campaignCharacterPortraitSettings]);
}
