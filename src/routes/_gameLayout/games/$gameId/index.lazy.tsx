import { createLazyFileRoute } from "@tanstack/react-router";

import { GameOverviewSheet } from "components/pages/games/overviewSheet/GameOverviewSheet";

export const Route = createLazyFileRoute("/_gameLayout/games/$gameId/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <GameOverviewSheet />;
}
