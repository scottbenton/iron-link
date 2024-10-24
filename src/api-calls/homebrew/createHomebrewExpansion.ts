import { addDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";
import { getHomebrewCollection } from "api-calls/homebrew/_getRef";
import { ExpansionDocument } from "api-calls/homebrew/_homebrewCollection.type";

export const createHomebrewExpansion = createApiFunction<
  ExpansionDocument,
  string
>((expansion: ExpansionDocument) => {
  return new Promise((resolve, reject) => {
    addDoc(getHomebrewCollection(), expansion)
      .then((doc) => {
        resolve(doc.id);
      })
      .catch(reject);
  });
}, "Failed to create expansion.");
