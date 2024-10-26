import { deleteDoc } from "firebase/firestore";

import { getHomebrewImpactsDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

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
