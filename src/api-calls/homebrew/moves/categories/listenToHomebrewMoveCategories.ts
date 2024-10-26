import { createHomebrewListenerFunction } from "api-calls/homebrew/homebrewListenerFunction";
import { getHomebrewMoveCategoryCollection } from "api-calls/homebrew/moves/categories/_getRef";

export const listenToHomebrewMoveCategories = createHomebrewListenerFunction(
  getHomebrewMoveCategoryCollection(),
);
