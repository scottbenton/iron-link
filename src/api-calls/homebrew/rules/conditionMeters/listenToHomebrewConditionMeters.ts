import { createHomebrewListenerFunction } from "api-calls/homebrew/homebrewListenerFunction";
import { getHomebrewConditionMeterCollection } from "api-calls/homebrew/rules/conditionMeters/_getRef";

export const listenToHomebrewConditionMeters = createHomebrewListenerFunction(
  getHomebrewConditionMeterCollection(),
);
