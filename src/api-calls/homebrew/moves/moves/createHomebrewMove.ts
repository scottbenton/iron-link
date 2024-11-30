import { addDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";
import { HomebrewMoveDocument } from "api-calls/homebrew/moves/moves/_homebrewMove.type";

import { getHomebrewMoveCollection } from "./_getRef";

export const createHomebrewMove = createApiFunction<
  { move: HomebrewMoveDocument },
  void
>((params) => {
  const { move } = params;
  return new Promise((resolve, reject) => {
    addDoc(getHomebrewMoveCollection(), move)
      .then(() => resolve())
      .catch(reject);
  });
}, "Failed to create move.");
