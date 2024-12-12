import { LinearProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation } from "react-router-dom";

import { PageContent, PageHeader } from "components/Layout";
import { EmptyState } from "components/Layout/EmptyState";

import { useGameStore } from "stores/game.store";

import { CampaignTabs } from "./components/CampaignTabs";
import { useSyncGame } from "./hooks/useSyncGame";

export function GameLayout() {
  const { t } = useTranslation();

  useSyncGame();

  const hasGame = useGameStore((state) => !!state.game);
  const error = useGameStore((state) => state.error);

  const { pathname } = useLocation();
  const isOnCharacterCreatePage = pathname.match(
    /\/games\/[^/]*\/create[/]?$/i,
  );

  if (!hasGame && !error) {
    return <LinearProgress />;
  }

  if (error) {
    return (
      <EmptyState message={t("game.load-failure", "Failed to load game.")} />
    );
  }

  return (
    <>
      <PageHeader
        maxWidth={isOnCharacterCreatePage ? "md" : undefined}
        disablePadding
        sx={(theme) => ({ borderBottom: `1px solid ${theme.palette.divider}` })}
      >
        <CampaignTabs />
      </PageHeader>
      <PageContent
        viewHeight={isOnCharacterCreatePage ? "min-full" : "max-full"}
        maxWidth={isOnCharacterCreatePage ? "md" : undefined}
      >
        <Outlet />
      </PageContent>
    </>
  );
}
