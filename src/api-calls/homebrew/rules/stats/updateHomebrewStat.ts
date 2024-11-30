import { PartialWithFieldValue, updateDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";
import { HomebrewStatDocument } from "api-calls/homebrew/rules/stats/_homebrewStat.type";

import { getHomebrewStatsDoc } from "./_getRef";

export const updateHomebrewStat = createApiFunction<
  {
    statId: string;
    stat: PartialWithFieldValue<HomebrewStatDocument>;
  },
  void
>((params) => {
  const { statId, stat } = params;
  return new Promise((resolve, reject) => {
    updateDoc(getHomebrewStatsDoc(statId), stat)
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
}, "Failed to update stat.");
