import {
  DocumentData,
  Query,
  QuerySnapshot,
  Unsubscribe,
  and,
  onSnapshot,
  or,
  query,
  where,
} from "firebase/firestore";

import { CampaignPermissionType } from "pages/games/gamePageLayout/hooks/usePermissions";

import { getNoteFolderCollection } from "./_getRef";
import { NoteFolder, ReadPermissions } from "./_notes.type";

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
    where("readPermissions", "==", ReadPermissions.Public),
  );
  const basePlayerPermissions = [
    where("readPermissions", "==", ReadPermissions.Public),
    where("readPermissions", "==", ReadPermissions.AllPlayers),
    and(
      where("readPermissions", "==", ReadPermissions.OnlyAuthor),
      where("creator", "==", uid),
    ),
    and(
      where("readPermissions", "==", ReadPermissions.GuidesAndAuthor),
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
        where("readPermissions", "==", ReadPermissions.OnlyGuides),
        where("readPermissions", "==", ReadPermissions.GuidesAndAuthor),
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
