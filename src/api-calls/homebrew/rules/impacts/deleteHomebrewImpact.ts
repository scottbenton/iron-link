import { deleteField, updateDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";
import { getHomebrewImpactsDoc } from "api-calls/homebrew/rules/impacts/_getRef";

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
