import { onSnapshot, query, Unsubscribe, where } from "firebase/firestore";
import { convertFromDatabase, getCampaignTracksCollection } from "./_getRef";
import { Track } from "types/Track.type";

export function listenToProgressTracks(
  gameId: string,
  status: string,
  addOrUpdateTracks: (tracks: Record<string, Track>) => void,
  removeTrack: (trackId: string) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError: (error: any) => void
): Unsubscribe | undefined {
  const q = query(
    getCampaignTracksCollection(gameId),
    where("status", "==", status)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const addOrUpdateChanges: { [trackId: string]: Track } = {};

      snapshot.docChanges().forEach((change) => {
        if (change.type === "removed") {
          removeTrack(change.doc.id);
        } else {
          addOrUpdateChanges[change.doc.id] = convertFromDatabase(
            change.doc.data()
          );
        }
      });
      addOrUpdateTracks(addOrUpdateChanges);
    },
    (error) => onError(error)
  );
}
