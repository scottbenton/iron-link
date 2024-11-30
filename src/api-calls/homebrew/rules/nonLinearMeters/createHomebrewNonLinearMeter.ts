import { addDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";
import { HomebrewNonLinearMeterDocument } from "api-calls/homebrew/rules/nonLinearMeters/_homebrewNonLinearMeter.type";

import { getHomebrewNonLinearMeterCollection } from "./_getRef";

export const createHomebrewNonLinearMeter = createApiFunction<
  {
    meter: HomebrewNonLinearMeterDocument;
  },
  void
>((params) => {
  const { meter } = params;
  return new Promise((resolve, reject) => {
    addDoc(getHomebrewNonLinearMeterCollection(), meter)
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
}, "Failed to create meter.");
