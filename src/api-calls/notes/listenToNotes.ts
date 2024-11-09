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

import { getNoteCollection } from "./_getRef";
import { NoteDocument, ViewPermissions } from "./_notes.type";
import { CampaignPermissionType } from "pages/games/gamePageLayout/hooks/usePermissions";

export function listenToNotes(
  uid: string,
  campaignId: string,
  permissions: CampaignPermissionType,
  accessibleParentNoteFolderIds: string[],
  onNotes: (notes: Record<string, NoteDocument>) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError: (error: any) => void,
): Unsubscribe {
  const parentNoteFolderWhere =
    accessibleParentNoteFolderIds.length > 0
      ? [where("parentFolderId", "in", accessibleParentNoteFolderIds)]
      : [];

  let noteQuery: Query<NoteDocument, DocumentData> = query(
    getNoteCollection(campaignId),
    or(
      where("viewPermissions.type", "==", ViewPermissions.Public),
      and(where("viewPermissions", "==", null), ...parentNoteFolderWhere),
    ),
  );
  const basePlayerPermissions = [
    where("viewPermissions.type", "==", ViewPermissions.Public),
    where("viewPermissions.type", "==", ViewPermissions.AllPlayers),
    and(
      where("viewPermissions.type", "==", ViewPermissions.OnlyAuthor),
      where("creator", "==", uid),
    ),
    and(
      where("viewPermissions", "==", null),

      ...parentNoteFolderWhere,
    ),
  ];
  if (permissions === CampaignPermissionType.Player) {
    noteQuery = query(
      getNoteCollection(campaignId),
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
    noteQuery = query(
      getNoteCollection(campaignId),
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
    noteQuery,
    (snapshot: QuerySnapshot<NoteDocument>) => {
      const notes: Record<string, NoteDocument> = {};
      snapshot.forEach((doc) => {
        notes[doc.id] = doc.data() as NoteDocument;
      });
      onNotes(notes);
    },
    onError,
  );
}
