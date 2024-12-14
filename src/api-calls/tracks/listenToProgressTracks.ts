import { Unsubscribe, onSnapshot, query, where } from "firebase/firestore";

import { ITrack } from "services/tracks.service";

import { convertFromDatabase, getCampaignTracksCollection } from "./_getRef";

export function listenToProgressTracks(
  gameId: string,
  status: string,
  addOrUpdateTracks: (tracks: Record<string, ITrack>) => void,
  removeTrack: (trackId: string) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError: (error: any) => void,
): Unsubscribe | undefined {
  const q = query(
    getCampaignTracksCollection(gameId),
    where("status", "==", status),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const addOrUpdateChanges: { [trackId: string]: ITrack } = {};

      snapshot.docChanges().forEach((change) => {
        if (change.type === "removed") {
          removeTrack(change.doc.id);
        } else {
          addOrUpdateChanges[change.doc.id] = convertFromDatabase(
            change.doc.data(),
          );
        }
      });
      addOrUpdateTracks(addOrUpdateChanges);
    },
    (error) => onError(error),
  );
}
