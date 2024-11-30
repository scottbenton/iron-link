import { PartialWithFieldValue, updateDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";
import { HomebrewImpactCategoryDocument } from "api-calls/homebrew/rules/impacts/_homebrewImpacts.type";

import { getHomebrewImpactsDoc } from "./_getRef";

export const updateHomebrewImpactCategory = createApiFunction<
  {
    impactCategoryId: string;
    impactCategory: PartialWithFieldValue<HomebrewImpactCategoryDocument>;
  },
  void
>((params) => {
  const { impactCategoryId, impactCategory } = params;
  return new Promise((resolve, reject) => {
    updateDoc(getHomebrewImpactsDoc(impactCategoryId), impactCategory)
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
}, "Failed to update condition meter.");
