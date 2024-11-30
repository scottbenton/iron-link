import { addDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";
import { HomebrewStatDocument } from "api-calls/homebrew/rules/stats/_homebrewStat.type";

import { getHomebrewStatsCollection } from "./_getRef";

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
