import { createLazyFileRoute } from "@tanstack/react-router";

import { WorldOverviewPage } from "components/pages/worlds/WorldOverviewPage/WorldOverviewPage";

export const Route = createLazyFileRoute("/_defaultNavLayout/worlds/$worldId/")(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  return <WorldOverviewPage />;
}
