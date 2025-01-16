import { createLazyFileRoute } from "@tanstack/react-router";

import { CharacterSheetPage } from "components/pages/games/characterSheet/CharacterSheetPage";

export const Route = createLazyFileRoute(
  "/_gameLayout/games/$gameId/c/$characterId",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <CharacterSheetPage />;
}
