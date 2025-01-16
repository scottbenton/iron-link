import { Tab, Tabs } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { MenuAdditionComponent } from "components/Layout/AppSettingsMenu";
import { NavBar } from "components/Layout/NavBar";

import { useGameStore } from "stores/game.store";
import { useGameCharacter } from "stores/gameCharacters.store";

import { usePathConfig } from "lib/paths.lib";

import { CharacterMenuDialogs } from "../characterSheet/components/CharacterSettingsMenu/CharacterMenuDialogs";
import { CharacterMenuItems } from "../characterSheet/components/CharacterSettingsMenu/CharacterMenuItems";
import { useCharacterIdOptional } from "../characterSheet/hooks/useCharacterId";
import { MobileTabs } from "./MobileTabs";
import { useGameId } from "./hooks/useGameId";

export interface GameNavBarProps {
  tab: MobileTabs;
  setTab: (tab: MobileTabs) => void;
  isOnOverviewPage: boolean;
  isOnCreatePage: boolean;
}

const menuItems: MenuAdditionComponent[] = [CharacterMenuItems];
const menuDialogs: MenuAdditionComponent[] = [CharacterMenuDialogs];

export function GameNavBar(props: GameNavBarProps) {
  const { tab, setTab, isOnOverviewPage, isOnCreatePage } = props;

  const hasCharacterId = !!useCharacterIdOptional();
  const gameId = useGameId();

  const { t } = useTranslation();
  const gameName = useGameStore((store) => store.game?.name);
  const characterName = useGameCharacter((character) => character?.name);

  const pathConfig = usePathConfig();

  const pageTitle = useMemo(() => {
    if (!hasCharacterId) {
      return gameName ?? t("common.loading", "Loading");
    } else {
      return characterName ?? t("common.loading", "Loading");
    }
  }, [t, gameName, hasCharacterId, characterName]);

  return (
    <NavBar
      goBackTo={
        hasCharacterId || isOnCreatePage
          ? { href: pathConfig.game, params: { gameId } }
          : { href: pathConfig.gameSelect }
      }
      pageTitle={pageTitle}
      secondLevel={
        isOnCreatePage ? undefined : (
          <Tabs
            value={tab}
            onChange={(_, newTab) => setTab(newTab)}
            variant="fullWidth"
            sx={{ flexGrow: 1, alignSelf: "flex-end" }}
          >
            {isOnOverviewPage && (
              <Tab
                label={t("game.overview", "Overview")}
                value={MobileTabs.Overview}
              />
            )}
            {!isOnOverviewPage && (
              <Tab
                label={t("game.character", "Character")}
                value={MobileTabs.Character}
              />
            )}
            <Tab label={t("game.notes", "Notes")} value={MobileTabs.Notes} />
            <Tab
              label={t("game.reference", "Reference")}
              value={MobileTabs.Reference}
            />
          </Tabs>
        )
      }
      menuAdditions={{
        menuItems: menuItems,
        menuDialogs: menuDialogs,
      }}
    />
  );
}