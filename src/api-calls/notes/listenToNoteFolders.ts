import {
  and,
  DocumentData,
  onSnapshot,
  or,
  Query,
  query,
  QuerySnapshot,
  Unsubscribe,
  where,
} from "firebase/firestore";

import { getNoteFolderCollection } from "./_getRef";
import { NoteFolder, ReadPermissions } from "./_notes.type";
import { CampaignPermissionType } from "pages/games/gamePageLayout/hooks/usePermissions";

export function listenToNoteFolders(
  uid: string,
  campaignId: string,
  permissions: CampaignPermissionType,
  onNoteFolders: (folders: Record<string, NoteFolder>) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError: (error: any) => void,
): Unsubscribe {
  let noteFolderQuery: Query<NoteFolder, DocumentData> = query(
    getNoteFolderCollection(campaignId),
    where("readPermissions.type", "==", ReadPermissions.Public),
  );
  const basePlayerPermissions = [
    where("readPermissions.type", "==", ReadPermissions.Public),
    where("readPermissions.type", "==", ReadPermissions.AllPlayers),
    and(
      where("readPermissions.type", "==", ReadPermissions.OnlyAuthor),
      where("creator", "==", uid),
    ),
    and(
      where("readPermissions.type", "==", ReadPermissions.GuidesAndAuthor),
      where("creator", "==", uid),
    ),
  ];
  if (permissions === CampaignPermissionType.Player) {
    noteFolderQuery = query(
      getNoteFolderCollection(campaignId),
      or(...basePlayerPermissions),
    );
  } else if (permissions === CampaignPermissionType.Guide) {
    noteFolderQuery = query(
      getNoteFolderCollection(campaignId),
      or(
        ...basePlayerPermissions,
        where("readPermissions.type", "==", ReadPermissions.OnlyGuides),
        where("readPermissions.type", "==", ReadPermissions.GuidesAndAuthor),
      ),
    );
  }

  return onSnapshot(
    noteFolderQuery,
    (snapshot: QuerySnapshot<NoteFolder>) => {
      const noteFolders: Record<string, NoteFolder> = {};
      snapshot.forEach((doc) => {
        noteFolders[doc.id] = doc.data() as NoteFolder;
      });
      onNoteFolders(noteFolders);
    },
    onError,
  );
}
