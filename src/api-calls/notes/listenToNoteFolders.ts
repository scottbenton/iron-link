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
import { NoteFolder, ViewPermissions } from "./_notes.type";
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
    where("viewPermissions.type", "==", ViewPermissions.Public),
  );
  const basePlayerPermissions = [
    where("viewPermissions.type", "==", ViewPermissions.Public),
    where("viewPermissions.type", "==", ViewPermissions.AllPlayers),
    and(
      where("viewPermissions.type", "==", ViewPermissions.OnlyAuthor),
      where("creator", "==", uid),
    ),
  ];
  if (permissions === CampaignPermissionType.Player) {
    noteFolderQuery = query(
      getNoteFolderCollection(campaignId),
      or(
        ...basePlayerPermissions,
        and(
          where(
            "viewPermissions.type",
            "==",
            ViewPermissions.GuidesAndPlayerSubset,
          ),
          where("viewPermissions.players", "array-contains", uid),
        ),
      ),
    );
  } else if (permissions === CampaignPermissionType.Guide) {
    console.debug("USING GUIDE NOTE QUERY");
    noteFolderQuery = query(
      getNoteFolderCollection(campaignId),
      or(
        ...basePlayerPermissions,
        where("viewPermissions.type", "==", ViewPermissions.OnlyGuides),
        where(
          "viewPermissions.type",
          "==",
          ViewPermissions.GuidesAndPlayerSubset,
        ),
      ),
    );
  }

  return onSnapshot(
    noteFolderQuery,
    (snapshot: QuerySnapshot<NoteFolder>) => {
      const noteFolders: Record<string, NoteFolder> = {};
      snapshot.forEach((doc) => {
        console.debug(doc);
        noteFolders[doc.id] = doc.data() as NoteFolder;
      });
      onNoteFolders(noteFolders);
    },
    onError,
  );
}
