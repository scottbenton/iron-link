import { useTranslation } from "react-i18next";
import { Outlet, useLocation } from "react-router-dom";
import { LinearProgress } from "@mui/material";
import { useAtomValue } from "jotai";

import { currentCampaignAtom } from "./atoms/campaign.atom";
import { CampaignTabs } from "./components/CampaignTabs";
import { useSyncCampaign } from "./hooks/useSyncCampaign";
import { derivedAtomWithEquality } from "atoms/derivedAtomWithEquality";
import { PageContent, PageHeader } from "components/Layout";
import { EmptyState } from "components/Layout/EmptyState";

const campaignState = derivedAtomWithEquality(currentCampaignAtom, (atom) => ({
  hasCampaign: !!atom.campaign,
  loading: atom.loading,
  error: atom.error,
}));

export function GameLayout() {
  const { t } = useTranslation();

  useSyncCampaign();

  const { hasCampaign, error } = useAtomValue(campaignState);
  const { pathname } = useLocation();
  const isOnCharacterCreatePage = pathname.match(
    /\/games\/[^/]*\/create[/]?$/i,
  );

  if (!hasCampaign && !error) {
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
