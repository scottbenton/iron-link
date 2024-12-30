import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { useGamePermissions } from "pages/games/gamePageLayout/hooks/usePermissions";

import { useUID } from "stores/auth.store";
import { GamePermission } from "stores/game.store";
import { GUIDE_NOTE_FOLDER_NAME, useNotesStore } from "stores/notes.store";

import { getItemName } from "../FolderView/getFolderName";
import { FAKE_ROOT_NOTE_FOLDER_KEY } from "../FolderView/rootNodeName";

interface BreadcrumbItem {
  type: "folder" | "note";
  isRootPlayerFolder?: boolean;
  id: string;
  name: string;
}

export function NoteBreadcrumbs() {
  const { t } = useTranslation();

  const uid = useUID();

  const setOpenItem = useNotesStore((store) => store.setOpenItem);

  const { gameType, gamePermission: campaignPermission } = useGamePermissions();
  const hasCampaignNoteChildren = useNotesStore(
    (store) =>
      Object.values(store.noteState.notes).some(
        (note) => note.parentFolderId === GUIDE_NOTE_FOLDER_NAME,
      ) ||
      Object.values(store.folderState.folders).some(
        (folder) => folder.parentFolderId === GUIDE_NOTE_FOLDER_NAME,
      ),
  );

  let hasAccessToMoreThanOneTopLevelFolder = false;
  if (
    (campaignPermission === GamePermission.Guide && gameType !== "solo") ||
    hasCampaignNoteChildren
  ) {
    hasAccessToMoreThanOneTopLevelFolder = true;
  }

  const breadcrumbItems: BreadcrumbItem[] = useNotesStore((store) => {
    let item = store.openItem;

    const breadcrumbs: BreadcrumbItem[] = [];

    while (item) {
      if (
        item.type !== "folder" ||
        item.folderId !== FAKE_ROOT_NOTE_FOLDER_KEY
      ) {
        breadcrumbs.push({
          type: item.type,
          id: item.type === "folder" ? item.folderId : item.noteId,
          name:
            item.type === "folder"
              ? getItemName({
                  name: store.folderState.folders[item.folderId]?.name,
                  id: item.folderId,
                  isRootPlayerFolder:
                    store.folderState.folders[item.folderId]
                      ?.isRootPlayerFolder ?? false,
                  t,
                })
              : store.noteState.notes[item.noteId]?.title,
        });
      }

      const parentFolderId =
        item.type === "folder"
          ? store.folderState.folders[item.folderId]?.parentFolderId
          : store.noteState.notes[item.noteId]?.parentFolderId;
      const parentFolder = parentFolderId
        ? store.folderState.folders[parentFolderId]
        : undefined;

      if (parentFolderId && !parentFolder && uid) {
        item = { type: "folder", folderId: uid };
      } else if (parentFolderId && parentFolder) {
        item = { type: "folder", folderId: parentFolderId };
      } else {
        item = undefined;
      }
    }

    if (hasAccessToMoreThanOneTopLevelFolder) {
      breadcrumbs.push({
        id: FAKE_ROOT_NOTE_FOLDER_KEY,
        type: "folder",
        name: FAKE_ROOT_NOTE_FOLDER_KEY,
      });
    }

    return breadcrumbs.reverse();
  });

  if (breadcrumbItems.length > 0) {
    return (
      <>
        <Breadcrumbs>
          {breadcrumbItems.map((item, index) =>
            index === breadcrumbItems.length - 1 ? (
              <Typography key={index}>{item.name}</Typography>
            ) : (
              <Link
                key={index}
                component={"button"}
                onClick={() =>
                  item.type === "folder"
                    ? setOpenItem("folder", item.id)
                    : setOpenItem("note", item.id)
                }
                sx={{ display: "flex" }}
                color="textPrimary"
              >
                {item.name}
              </Link>
            ),
          )}
        </Breadcrumbs>
      </>
    );
  }
  return null;
}
