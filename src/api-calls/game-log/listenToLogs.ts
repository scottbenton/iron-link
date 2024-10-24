import {
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryConstraint,
  Unsubscribe,
  where,
} from "firebase/firestore";

import {
  convertFromDatabase,
  getCampaignGameLogCollection,
} from "api-calls/game-log/_getRef";
import { Roll } from "types/DieRolls.type";

export function listenToLogs(params: {
  isGM: boolean;
  campaignId: string;
  totalLogsToLoad: number;
  updateLog: (rollId: string, roll: Roll) => void;
  removeLog: (rollId: string) => void;
  onError: (error: string) => void;
  onLoaded: () => void;
}): Unsubscribe {
  const {
    isGM,
    campaignId,
    totalLogsToLoad,
    updateLog,
    removeLog,
    onLoaded,
    onError,
  } = params;

  const collection = getCampaignGameLogCollection(campaignId);

  const queryConstraints: QueryConstraint[] = [
    limit(totalLogsToLoad),
    orderBy("timestamp", "desc"),
  ];
  if (!isGM) {
    queryConstraints.push(where("gmsOnly", "==", false));
  }

  return onSnapshot(
    query(collection, ...queryConstraints),
    (snapshot) => {
      if (snapshot.docChanges().length === 0) {
        onLoaded();
      }
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added" || change.type === "modified") {
          const doc = convertFromDatabase(change.doc.data());
          updateLog(change.doc.id, doc);
        } else if (change.type === "removed") {
          removeLog(change.doc.id);
        }
      });
    },
    (error) => {
      console.error(error);
      onError("Error getting new logs.");
    },
  );
}
