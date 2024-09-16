import { App } from "App";
import { Layout } from "components/Layout";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { LoginPage } from "./auth/LoginPage";
import { SignUpPage } from "./auth/SignUpPage";
import { CharacterSelectPage } from "./characters/selectPage/CharacterSelectPage";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      <Route element={<Layout />}>
        <Route path={"/"} element={<div>Home</div>} />
        <Route path={"/sign-in"} element={<LoginPage />} />
        <Route path={"/sign-up"} element={<SignUpPage />} />
        <Route path={"/characters"}>
          <Route index element={<CharacterSelectPage />} />
        </Route>
        <Route path={"/campaigns"}>
          <Route index element={<div>Campaigns</div>} />
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
