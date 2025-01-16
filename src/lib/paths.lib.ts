import { useMemo } from "react";
import { Route as auth } from "routes/_defaultNavLayout/auth";
import { Route as gameJoin } from "routes/_defaultNavLayout/games/$gameId/join";
import { Route as gameCreate } from "routes/_defaultNavLayout/games/create";
import { Route as gameSelect } from "routes/_defaultNavLayout/games/index";
import { Route as homebrewSelect } from "routes/_defaultNavLayout/homebrew";
import { Route as homeRoute } from "routes/_defaultNavLayout/index";
import { Route as worldSelect } from "routes/_defaultNavLayout/worlds";
import { Route as gameCharacter } from "routes/_gameLayout/games/$gameId/c/$characterId";
import { Route as gameCharacterCreate } from "routes/_gameLayout/games/$gameId/create";
import { Route as game } from "routes/_gameLayout/games/$gameId/index";

export function usePathConfig() {
  return useMemo(
    () => ({
      home: homeRoute.to,
      gameSelect: gameSelect.to,
      gameCreate: gameCreate.to,
      game: game.to,
      gameCharacter: gameCharacter.to,
      gameCharacterCreate: gameCharacterCreate.to,
      gameJoin: gameJoin.to,
      worldSelect: worldSelect.to,
      homebrewSelect: homebrewSelect.to,
      auth: auth.to,
    }),
    [],
  );
}
