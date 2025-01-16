import { createLazyFileRoute } from '@tanstack/react-router'

import { GameSelectPage } from 'components/pages/games/selectPage/GameSelectPage'

export const Route = createLazyFileRoute('/_defaultNavLayout/games/')({
  component: RouteComponent,
})
function RouteComponent() {
  return <GameSelectPage />
}
