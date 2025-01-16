import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute(
  '/_defaultNavLayout/games/$gameId/join',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/games/$gameId/join"!</div>
}
