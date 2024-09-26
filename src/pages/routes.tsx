import { App } from "App";
import { Layout } from "components/Layout";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { LoginPage } from "./auth/LoginPage";
import { SignUpPage } from "./auth/SignUpPage";
import { GameSelectPage } from "./games/selectPage/GameSelectPage";
import { CreateGamePage } from "./games/create/CreateGamePage";
import { GameLayout } from "./games/gamePageLayout/GameLayout";
import { AddCharacter } from "./games/addCharacter/AddCharacter";
import { CharacterSheetPage } from "./games/characterSheet/CharacterSheetPage";
import { GameOverviewSheet } from "./games/overviewSheet/GameOverviewSheet";
import { GameJoinPage } from "./games/join/GameJoinPage";

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
    </Route>
  )
);
