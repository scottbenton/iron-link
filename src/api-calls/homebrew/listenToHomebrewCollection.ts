import { onSnapshot } from "firebase/firestore";

import { getHomebrewCollectionDoc } from "api-calls/homebrew/_getRef";
import { HomebrewCollectionDocument } from "api-calls/homebrew/_homebrewCollection.type";

export function listenToHomebrewCollection(
  collectionId: string,
  updateCollection: (collection: HomebrewCollectionDocument) => void,
  onError: (error: unknown) => void,
  onLoaded: () => void,
) {
  return onSnapshot(
    getHomebrewCollectionDoc(collectionId),
    (snapshot) => {
      const data = snapshot.data();
      if (data) {
        updateCollection(data);
      } else {
        onLoaded();
      }
    },
    (error) => {
      console.error(error);
      onError(error);
    },
  );
}
