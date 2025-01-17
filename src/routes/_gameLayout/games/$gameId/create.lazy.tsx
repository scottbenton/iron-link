import { createLazyFileRoute } from '@tanstack/react-router'

import { AddCharacter } from 'components/pages/games/addCharacter/AddCharacter'

export const Route = createLazyFileRoute('/_gameLayout/games/$gameId/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AddCharacter />
}
