import { deleteDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";
import { getHomebrewImpactsDoc } from "api-calls/homebrew/rules/impacts/_getRef";

export const deleteHomebrewImpactCategory = createApiFunction<
  {
    impactCategoryId: string;
  },
  void
>((params) => {
  const { impactCategoryId } = params;
  return new Promise((resolve, reject) => {
    deleteDoc(getHomebrewImpactsDoc(impactCategoryId))
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
}, "Failed to delete impact category.");
