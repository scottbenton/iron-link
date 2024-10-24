import { Tab, Tabs } from "@mui/material";
import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import { useLocation, useParams } from "react-router-dom";

import { useAuthAtom } from "atoms/auth.atom";
import { derivedAtomWithEquality } from "atoms/derivedAtomWithEquality";
import { LinkComponent } from "components/LinkComponent";
import { currentCampaignAtom } from "pages/games/gamePageLayout/atoms/campaign.atom";
import { campaignCharactersAtom } from "pages/games/gamePageLayout/atoms/campaign.characters.atom";
import { pathConfig } from "pages/pathConfig";

const campaignCharacterList = derivedAtomWithEquality(
  currentCampaignAtom,
  (atom) => atom.campaign?.characters ?? [],
);
const characterNames = derivedAtomWithEquality(
  campaignCharactersAtom,
  (atom) => {
    const names: Record<string, string | undefined> = {};
    Object.entries(atom).forEach(([characterId, characterState]) => {
      names[characterId] = characterState.characterDocument.data?.name;
    });
    return names;
  },
);

export function CampaignTabs() {
  const { campaignId, characterId } = useParams<{
    campaignId: string;
    characterId?: string;
  }>();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const isOnCharacterCreatePage = pathname.match(
    /\/games\/[^/]*\/create[/]?$/i,
  );

  const characterList = useAtomValue(campaignCharacterList);
  const names = useAtomValue(characterNames);

  const uid = useAuthAtom()[0].uid;

  // Sort users characters to the front
  const sortedCharacterList = characterList.sort((a, b) => {
    if (a.uid !== b.uid) {
      if (a.uid === uid) return -1;
      if (b.uid === uid) return 1;
    }
    return 0;
  });

  if (!campaignId) return null;

  return (
    <Tabs
      value={
        characterId ??
        (isOnCharacterCreatePage ? "create-character" : "overview")
      }
      variant="scrollable"
      scrollButtons="auto"
    >
      <Tab
        LinkComponent={LinkComponent}
        href={pathConfig.game(campaignId)}
        value={"overview"}
        label={t("game.layout.overview", "Overview")}
      />
      {sortedCharacterList.map((character) => (
        <Tab
          LinkComponent={LinkComponent}
          href={pathConfig.gameCharacter(campaignId, character.characterId)}
          key={character.characterId}
          value={character.characterId}
          label={names[character.characterId] ?? t("common.loading", "Loading")}
        />
      ))}
      <Tab
        LinkComponent={LinkComponent}
        href={pathConfig.gameCharacterCreate(campaignId)}
        value={"create-character"}
        label={t("game.layout.add-character", "Add Character")}
      />
    </Tabs>
  );
}
