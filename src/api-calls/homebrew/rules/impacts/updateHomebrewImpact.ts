import { updateDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";
import { HomebrewImpact } from "api-calls/homebrew/rules/impacts/_homebrewImpacts.type";

import { getHomebrewImpactsDoc } from "./_getRef";

export const updateHomebrewImpact = createApiFunction<
  {
    impactCategoryId: string;
    impact: HomebrewImpact;
  },
  void
>((params) => {
  const { impactCategoryId, impact } = params;
  return new Promise((resolve, reject) => {
    updateDoc(getHomebrewImpactsDoc(impactCategoryId), {
      [`contents.${impact.dataswornId}`]: impact,
    })
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
}, "Failed to update impact.");
