import { deleteDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";
import { getHomebrewMoveCategoryDoc } from "api-calls/homebrew/moves/categories/_getRef";

export const deleteHomebrewMoveCategory = createApiFunction<
  {
    moveCategoryId: string;
  },
  void
>((params) => {
  const { moveCategoryId } = params;
  return new Promise((resolve, reject) => {
    deleteDoc(getHomebrewMoveCategoryDoc(moveCategoryId))
      .then(resolve)
      .catch(reject);
  });
}, "Failed to delete move category.");
