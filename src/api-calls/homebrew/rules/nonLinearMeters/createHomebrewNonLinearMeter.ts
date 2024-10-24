import { addDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";
import { getHomebrewNonLinearMeterCollection } from "api-calls/homebrew/rules/nonLinearMeters/_getRef";
import { HomebrewNonLinearMeterDocument } from "api-calls/homebrew/rules/nonLinearMeters/_homebrewNonLinearMeter.type";

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
