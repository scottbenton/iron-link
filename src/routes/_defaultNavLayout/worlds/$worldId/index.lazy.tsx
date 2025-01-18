import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_defaultNavLayout/worlds/$worldId/')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  return <div>Hello "/_defaultNavLayout/worlds/$worldId/"!</div>
}
