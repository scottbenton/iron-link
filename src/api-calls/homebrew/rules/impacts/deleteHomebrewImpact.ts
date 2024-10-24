import { deleteField, updateDoc } from "firebase/firestore";

import { getHomebrewImpactsDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const deleteHomebrewImpact = createApiFunction<
  {
    impactCategoryId: string;
    impactId: string;
  },
  void
>((params) => {
  const { impactCategoryId, impactId } = params;
  return new Promise((resolve, reject) => {
    updateDoc(getHomebrewImpactsDoc(impactCategoryId), {
      [`contents.${impactId}`]: deleteField(),
    })
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
}, "Failed to delete impact.");
