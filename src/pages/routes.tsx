import { Button } from "@mui/material";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

export const routes = {
  home: "/",
  characterSelect: "/characters",
  characterCreate: "/characters/create",
  character: (characterId: string) => `/characters/${characterId}`,
  campaignSelect: "/campaigns",
  campaign: (campaignId: string) => `/campaigns/${campaignId}`,
  worldSelect: "/worlds",
  world: (worldId: string) => `/worlds/${worldId}`,
  homebrewSelect: "/homebrew",
  homebrew: (homebrewId: string) => `/homebrew/${homebrewId}`,
  signIn: "/sign-in",
  signUp: "/sign-up",
};

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        <>
          <span>Hello World</span>
          <Button>Hello World</Button>
        </>
      }
    />
  )
);
