import { Tabs } from "@mui/material";
import { useLocation } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { TabLink } from "components/LinkComponent";
import { useCharacterIdOptional } from "components/pages/games/characterSheet/hooks/useCharacterId";

import { useUID } from "stores/auth.store";
import { useGameCharactersStore } from "stores/gameCharacters.store";

import { usePathConfig } from "lib/paths.lib";

import { useGameId } from "../hooks/useGameId";

export function GameTabs() {
  const gameId = useGameId();
  const characterId = useCharacterIdOptional();
  const uid = useUID();

  const { t } = useTranslation();
  const { pathname } = useLocation();
  const isOnCharacterCreatePage = pathname.match(
    /\/games\/[^/]*\/create[/]?$/i,
  );
  const pathConfig = usePathConfig();

  const areCharactersLoading = useGameCharactersStore((store) => store.loading);

  const sortedGameCharacters = useGameCharactersStore((store) => {
    return Object.entries(store.characters)
      .map(([key, value]) => {
        return {
          id: key,
          name: value.name,
          uid: value.uid,
        };
      })
      .sort((a, b) => {
        if (a.uid !== b.uid) {
          if (a.uid === uid) return -1;
          if (b.uid === uid) return 1;
        }
        return a.name.localeCompare(b.name);
      });
  });

  if (areCharactersLoading) {
    return null;
  }

  return (
    <Tabs
      value={
        characterId ??
        (isOnCharacterCreatePage ? "create-character" : "overview")
      }
      variant="scrollable"
      scrollButtons="auto"
    >
      <TabLink
        to={pathConfig.game}
        params={{ gameId }}
        value={"overview"}
        label={t("game.layout.overview", "Overview")}
      />
      {sortedGameCharacters.map((character) => (
        <TabLink
          to={pathConfig.gameCharacter}
          params={{ gameId, characterId: character.id }}
          key={character.id}
          value={character.id}
          label={character.name ?? t("common.loading", "Loading")}
        />
      ))}
      <TabLink
        to={pathConfig.gameCharacterCreate}
        params={{ gameId }}
        value={"create-character"}
        label={t("game.layout.add-character", "Add Character")}
      />
    </Tabs>
  );
}
