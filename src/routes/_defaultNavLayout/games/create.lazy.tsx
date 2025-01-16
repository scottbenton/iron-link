import { createLazyFileRoute } from "@tanstack/react-router";

import { CreateGamePage } from "components/pages/games/create/CreateGamePage";

export const Route = createLazyFileRoute("/_defaultNavLayout/games/create")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CreateGamePage />;
}
