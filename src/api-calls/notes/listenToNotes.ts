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
import { NoteDocument, ReadPermissions } from "./_notes.type";
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
  const parentNoteFolderQuery =
    accessibleParentNoteFolderIds.length > 0
      ? [
          and(
            where("readPermissions", "==", null),
            where("parentFolderId", "in", accessibleParentNoteFolderIds),
          ),
        ]
      : [];

  let noteQuery: Query<NoteDocument, DocumentData> = query(
    getNoteCollection(campaignId),
    or(
      where("readPermissions", "==", ReadPermissions.Public),
      ...parentNoteFolderQuery,
    ),
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
    ...parentNoteFolderQuery,
  ];
  if (permissions === CampaignPermissionType.Player) {
    noteQuery = query(
      getNoteCollection(campaignId),
      or(
        ...basePlayerPermissions,
        and(
          where("readPermissions", "==", ReadPermissions.GuidesAndAuthor),
          where("readPermissions.players", "array-contains", uid),
        ),
      ),
    );
  } else if (permissions === CampaignPermissionType.Guide) {
    noteQuery = query(
      getNoteCollection(campaignId),
      or(
        ...basePlayerPermissions,
        where("readPermissions", "==", ReadPermissions.OnlyGuides),
        where("readPermissions", "==", ReadPermissions.GuidesAndAuthor),
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
