import { addDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";
import { getHomebrewStatsCollection } from "api-calls/homebrew/rules/stats/_getRef";
import { HomebrewStatDocument } from "api-calls/homebrew/rules/stats/_homebrewStat.type";

export const createHomebrewStat = createApiFunction<
  {
    stat: HomebrewStatDocument;
  },
  void
>((params) => {
  const { stat } = params;
  return new Promise((resolve, reject) => {
    addDoc(getHomebrewStatsCollection(), stat)
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
}, "Failed to create stat.");
