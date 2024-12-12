import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import {
  useDerivedNotesAtom,
  useSetOpenItem,
} from "pages/games/gamePageLayout/atoms/notes.atom";
import { useCampaignPermissions } from "pages/games/gamePageLayout/hooks/usePermissions";

import { GUIDE_NOTE_FOLDER_NAME } from "api-calls/notes/_getRef";

import { useUID } from "stores/auth.store";
import { GamePermission } from "stores/game.store";

import { getItemName } from "../FolderView/getFolderName";
import { FAKE_ROOT_NOTE_FOLDER_KEY } from "../FolderView/rootNodeName";

interface BreadcrumbItem {
  type: "folder" | "note";
  id: string;
  name: string;
}

export function NoteBreadcrumbs() {
  const { t } = useTranslation();

  const uid = useUID();

  const setOpenItem = useSetOpenItem();

  const { gameType: campaignType, gamePermission: campaignPermission } =
    useCampaignPermissions();
  const hasCampaignNoteChildren = useDerivedNotesAtom(
    (store) =>
      Object.values(store.notes.notes).some(
        (note) => note.parentFolderId === GUIDE_NOTE_FOLDER_NAME,
      ) ||
      Object.values(store.folders.folders).some(
        (folder) => folder.parentFolderId === GUIDE_NOTE_FOLDER_NAME,
      ),
  );

  let hasAccessToMoreThanOneTopLevelFolder = false;
  if (
    (campaignPermission === GamePermission.Guide && campaignType !== "solo") ||
    hasCampaignNoteChildren
  ) {
    hasAccessToMoreThanOneTopLevelFolder = true;
  }

  const breadcrumbItems: BreadcrumbItem[] = useDerivedNotesAtom(
    (store) => {
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
                ? store.folders.folders[item.folderId]?.name
                : store.notes.notes[item.noteId]?.title,
          });
        }

        const parentFolderId =
          item.type === "folder"
            ? store.folders.folders[item.folderId]?.parentFolderId
            : store.notes.notes[item.noteId]?.parentFolderId;
        const parentFolder = parentFolderId
          ? store.folders.folders[parentFolderId]
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
    },
    [hasAccessToMoreThanOneTopLevelFolder],
  );

  if (breadcrumbItems.length > 0) {
    return (
      <>
        <Breadcrumbs>
          {breadcrumbItems.map((item, index) =>
            index === breadcrumbItems.length - 1 ? (
              <Typography key={index}>
                {getItemName({
                  name: item.name,
                  id: item.id,
                  uid,
                  t,
                  campaignType,
                })}
              </Typography>
            ) : (
              <Link
                key={index}
                component={"button"}
                onClick={() =>
                  item.type === "folder"
                    ? setOpenItem({
                        type: "folder",
                        folderId: item.id,
                      })
                    : setOpenItem({
                        type: "note",
                        noteId: item.id,
                      })
                }
                sx={{ display: "flex" }}
                color="textPrimary"
              >
                {getItemName({
                  name: item.name,
                  id: item.id,
                  uid,
                  t,
                  campaignType,
                })}
              </Link>
            ),
          )}
        </Breadcrumbs>
      </>
    );
  }
  return null;
}
