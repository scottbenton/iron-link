import { createHomebrewListenerFunction } from "api-calls/homebrew/homebrewListenerFunction";
import { getHomebrewNonLinearMeterCollection } from "api-calls/homebrew/rules/nonLinearMeters/_getRef";

export const listenToHomebrewNonLinearMeters = createHomebrewListenerFunction(
  getHomebrewNonLinearMeterCollection(),
);
