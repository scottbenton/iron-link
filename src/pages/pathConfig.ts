export const pathConfig = {
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

// Can be accessed regardless of authentication status
export const openPaths = [
  pathConfig.signIn,
  pathConfig.signUp,
  pathConfig.home,
  // Homebrew editor
];

// Cannot be accessed while logged in
export const onlyUnauthenticatedPaths = [pathConfig.signIn, pathConfig.signUp];
