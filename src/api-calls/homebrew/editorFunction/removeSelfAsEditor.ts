import { httpsCallable } from "firebase/functions";

import { functions } from "config/firebase.config";

export function removeSelfAsEditor(
  homebrewCollectionId: string,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const removeEditor = httpsCallable(
      functions,
      "removeCurrentUserAsHomebrewCampaignEditor",
    );

    removeEditor({ homebrewCollectionId })
      .then((wasSuccessful) => {
        resolve(wasSuccessful.data as boolean);
      })
      .catch((e) => {
        console.error(e);
        reject(e);
      });
  });
}
