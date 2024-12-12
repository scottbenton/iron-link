import { setDoc } from "firebase/firestore";

import { Roll } from "types/DieRolls.type";

import { createApiFunction } from "api-calls/createApiFunction";

import {
  convertRollToGameLogDocument,
  getCampaignGameLogDocument,
} from "./_getRef";

export const addRoll = createApiFunction<
  { roll: Roll; gameId: string; rollId: string },
  void
>((params) => {
  const { gameId, rollId, roll } = params;

  return new Promise((resolve, reject) => {
    setDoc(
      getCampaignGameLogDocument(gameId, rollId),
      convertRollToGameLogDocument(roll),
    )
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to add roll to log.");
