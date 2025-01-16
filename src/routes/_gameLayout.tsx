import { Box, LinearProgress, useMediaQuery, useTheme } from "@mui/material";
import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { PageContent, PageHeader } from "components/Layout";
import { EmptyState } from "components/Layout/EmptyState";
import { NotesSection } from "components/pages/games/characterSheet/components/NotesSection";
import { ReferenceSidebarContents } from "components/pages/games/characterSheet/components/ReferenceSidebarContents";
import { useCharacterIdOptional } from "components/pages/games/characterSheet/hooks/useCharacterId";
import { GameNavBar } from "components/pages/games/gamePageLayout/GameNavBar";
import { MobileTabs } from "components/pages/games/gamePageLayout/MobileTabs";
import { SidebarLayout } from "components/pages/games/gamePageLayout/SidebarLayout";
import { GameTabs } from "components/pages/games/gamePageLayout/components/GameTabs";
import { useSyncGame } from "components/pages/games/gamePageLayout/hooks/useSyncGame";

import { useGameStore } from "stores/game.store";

export const Route = createFileRoute("/_gameLayout")({
  component: RouteComponent,
});

function tabPanelProps(
  value: MobileTabs,
  tab: MobileTabs | MobileTabs[],
  padded: boolean,
) {
  const isHidden = Array.isArray(tab) ? !tab.includes(value) : value !== tab;
  return {
    hidden: isHidden,
    role: "tabpanel",
    id: `tabpanel-${tab}`,
    "aria-labelledby": `tab-${tab}`,
    pb: 2,
    px: padded ? 2 : 0,
    sx: {
      display: isHidden ? "none" : "flex",
      flexDirection: "column",
      overflow: "auto",
      flexGrow: 1,
    },
  };
}

function RouteComponent() {
  const { t } = useTranslation();

  useSyncGame();
  const characterId = useCharacterIdOptional();

  const hasGame = useGameStore((state) => !!state.game);
  const error = useGameStore((state) => state.error);

  const { pathname } = useLocation();

  const isOnCharacterCreatePage =
    pathname.match(/\/games\/[^/]*\/create[/]?$/i) !== null;

  const isOnOverviewPage = !isOnCharacterCreatePage && !characterId;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [openMobileTab, setOpenMobileTab] = useState(
    isOnOverviewPage ? MobileTabs.Overview : MobileTabs.Character,
  );

  useEffect(() => {
    if (isOnOverviewPage) {
      setOpenMobileTab(MobileTabs.Overview);
    } else if (characterId) {
      setOpenMobileTab(MobileTabs.Character);
    }
  }, [isOnOverviewPage, characterId]);

  if (!hasGame && !error) {
    return <LinearProgress />;
  }

  if (error) {
    return (
      <EmptyState message={t("game.load-failure", "Failed to load game.")} />
    );
  }

  if (isOnCharacterCreatePage) {
    return (
      <>
        <GameNavBar
          tab={openMobileTab}
          setTab={setOpenMobileTab}
          isOnCreatePage
          isOnOverviewPage={false}
        />

        {!isMobile && (
          <PageHeader
            maxWidth={"md"}
            disablePadding
            sx={(theme) => ({
              borderBottom: `1px solid ${theme.palette.divider}`,
            })}
          >
            <GameTabs />
          </PageHeader>
        )}
        <PageContent viewHeight={"min-full"} maxWidth={"md"}>
          <Outlet />
        </PageContent>
      </>
    );
  }

  return (
    <>
      <GameNavBar
        tab={openMobileTab}
        setTab={setOpenMobileTab}
        isOnOverviewPage={isOnOverviewPage}
        isOnCreatePage={isOnCharacterCreatePage}
      />
      {!isMobile && (
        <PageHeader
          maxWidth={isOnCharacterCreatePage ? "md" : undefined}
          disablePadding
          sx={(theme) => ({
            borderBottom: `1px solid ${theme.palette.divider}`,
          })}
        >
          <GameTabs />
        </PageHeader>
      )}
      <PageContent
        disablePadding={!isOnCharacterCreatePage || isMobile}
        viewHeight={isOnCharacterCreatePage ? "min-full" : "max-full"}
        maxWidth={isOnCharacterCreatePage ? "md" : undefined}
      >
        {isMobile ? (
          <>
            <Box
              {...tabPanelProps(
                openMobileTab,
                [MobileTabs.Overview, MobileTabs.Character],
                true,
              )}
            >
              <Outlet />
            </Box>
            <Box {...tabPanelProps(openMobileTab, MobileTabs.Notes, true)}>
              <NotesSection />
            </Box>
            <Box {...tabPanelProps(openMobileTab, MobileTabs.Reference, false)}>
              <ReferenceSidebarContents />
            </Box>
          </>
        ) : (
          <SidebarLayout />
        )}
      </PageContent>
    </>
  );
}