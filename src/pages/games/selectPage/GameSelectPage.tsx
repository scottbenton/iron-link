import { useTranslation } from "react-i18next";

import { useUsersCampaigns } from "atoms/users.campaigns";
import { GradientButton } from "components/GradientButton";
import { PageContent, PageHeader } from "components/Layout";
import { GridLayout } from "components/Layout/GridLayout";
import { CampaignCard } from "pages/games/selectPage/CampaignCard";
import { pathConfig } from "pages/pathConfig";

export function GameSelectPage() {
  const { t } = useTranslation();
  const campaignState = useUsersCampaigns();

  return (
    <>
      <PageHeader
        label={t("game.list.header", "Your Games")}
        actions={
          <GradientButton href={pathConfig.gameCreate}>
            {t("game.list.create", "Create Game")}
          </GradientButton>
        }
      />
      <PageContent>
        <GridLayout
          items={Object.entries(campaignState.campaigns)}
          renderItem={([campaignId, campaign]) => (
            <CampaignCard campaignId={campaignId} campaign={campaign} />
          )}
          loading={campaignState.loading}
          error={campaignState.error}
          emptyStateMessage={t("game.list.no-games-found", "No games found")}
          emptyStateAction={
            <GradientButton href={pathConfig.gameCreate}>
              {t("game.list.create", "Create Game")}
            </GradientButton>
          }
          minWidth={300}
        />
      </PageContent>
    </>
  );
}
