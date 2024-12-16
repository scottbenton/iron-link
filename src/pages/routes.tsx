import { App } from "App";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import { Layout } from "components/Layout";

import { LoginPage } from "./auth/LoginPage";
import { SignUpPage } from "./auth/SignUpPage";
import { AddCharacter } from "./games/addCharacter/AddCharacter";
import { CharacterSheetPage } from "./games/characterSheet/CharacterSheetPage";
import { CreateGamePage } from "./games/create/CreateGamePage";
import { GameLayout } from "./games/gamePageLayout/GameLayout";
import { GameJoinPage } from "./games/join/GameJoinPage";
import { GameOverviewSheet } from "./games/overviewSheet/GameOverviewSheet";
import { GameSelectPage } from "./games/selectPage/GameSelectPage";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      <Route element={<Layout />}>
        <Route path={"/"} element={<div>Home</div>} />
        <Route path={"/sign-in"} element={<LoginPage />} />
        <Route path={"/sign-up"} element={<SignUpPage />} />
        <Route path={"/games"}>
          <Route index element={<GameSelectPage />} />
          <Route path={"create"} element={<CreateGamePage />} />
          <Route path={":gameId"} element={<GameLayout />}>
            <Route index element={<GameOverviewSheet />} />
            <Route path={"c/:characterId"} element={<CharacterSheetPage />} />
            <Route path={"create"} element={<AddCharacter />} />
          </Route>
          <Route path={":gameId/join"} element={<GameJoinPage />} />
        </Route>
        <Route path={"/worlds"}>
          <Route index element={<div>Worlds</div>} />
        </Route>
        <Route path={"/homebrew"}>
          <Route index element={<div>Homebrew</div>} />
        </Route>
      </Route>
    </Route>,
  ),
);
