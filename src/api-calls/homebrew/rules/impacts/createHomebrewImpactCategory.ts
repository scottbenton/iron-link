import { addDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";
import { HomebrewImpactCategoryDocument } from "api-calls/homebrew/rules/impacts/_homebrewImpacts.type";

import { getHomebrewImpactsCollection } from "./_getRef";

export const createHomebrewImpactCategory = createApiFunction<
  {
    impactCategory: HomebrewImpactCategoryDocument;
  },
  void
>((params) => {
  const { impactCategory } = params;
  return new Promise((resolve, reject) => {
    addDoc(getHomebrewImpactsCollection(), impactCategory)
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
}, "Failed to create impact category.");
