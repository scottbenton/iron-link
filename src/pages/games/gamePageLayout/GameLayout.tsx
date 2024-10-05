import { LinearProgress } from "@mui/material";
import { derivedAtomWithEquality } from "atoms/derivedAtomWithEquality";
import { PageContent, PageHeader } from "components/Layout";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation } from "react-router-dom";
import { currentCampaignAtom } from "./atoms/campaign.atom";
import { useAtomValue } from "jotai";
import { EmptyState } from "components/Layout/EmptyState";
import { useSyncCampaign } from "./hooks/useSyncCampaign";
import { CampaignTabs } from "./components/CampaignTabs";

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
    /\/games\/[^/]*\/create[/]?$/i
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
        viewHeight
        maxWidth={isOnCharacterCreatePage ? "md" : undefined}
      >
        <Outlet />
      </PageContent>
    </>
  );
}
