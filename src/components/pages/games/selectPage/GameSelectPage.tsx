import { useTranslation } from "react-i18next";
import { Route as createGameRoute } from "routes/_defaultNavLayout/games/create";

import { GradientButton } from "components/GradientButton";
import { PageContent, PageHeader } from "components/Layout";
import { GridLayout } from "components/Layout/GridLayout";

import { useLoadUsersGames, useUsersGames } from "stores/users.games.store";

import { GameCard } from "./GameCard";

export function GameSelectPage() {
  const { t } = useTranslation();

  useLoadUsersGames();
  const gameState = useUsersGames();

  return (
    <>
      <PageHeader
        label={t("game.list.header", "Your Games")}
        actions={
          <GradientButton href={createGameRoute.to}>
            {t("game.list.create", "Create Game")}
          </GradientButton>
        }
      />
      <PageContent>
        <GridLayout
          items={Object.entries(gameState.games)}
          renderItem={([gameId, game]) => (
            <GameCard gameId={gameId} game={game} />
          )}
          loading={gameState.loading}
          error={
            gameState.error
              ? t(
                  "game.list.error-loading-games",
                  "Failed to load your games. Please try again later.",
                )
              : undefined
          }
          emptyStateMessage={t("game.list.no-games-found", "No games found")}
          emptyStateAction={
            <GradientButton href={createGameRoute.to}>
              {t("game.list.create", "Create Game")}
            </GradientButton>
          }
          minWidth={300}
        />
      </PageContent>
    </>
  );
}
