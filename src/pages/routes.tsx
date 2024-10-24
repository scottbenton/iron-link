import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { App } from "App";
import { Layout } from "components/Layout";
import { LoginPage } from "pages/auth/LoginPage";
import { SignUpPage } from "pages/auth/SignUpPage";
import { AddCharacter } from "pages/games/addCharacter/AddCharacter";
import { CharacterSheetPage } from "pages/games/characterSheet/CharacterSheetPage";
import { CreateGamePage } from "pages/games/create/CreateGamePage";
import { GameLayout } from "pages/games/gamePageLayout/GameLayout";
import { GameJoinPage } from "pages/games/join/GameJoinPage";
import { GameOverviewSheet } from "pages/games/overviewSheet/GameOverviewSheet";
import { GameSelectPage } from "pages/games/selectPage/GameSelectPage";

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
          <Route path={":campaignId"} element={<GameLayout />}>
            <Route index element={<GameOverviewSheet />} />
            <Route path={"c/:characterId"} element={<CharacterSheetPage />} />
            <Route path={"create"} element={<AddCharacter />} />
          </Route>
          <Route path={":campaignId/join"} element={<GameJoinPage />} />
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
