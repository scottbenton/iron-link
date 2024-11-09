import { Breadcrumbs, Link, Typography } from "@mui/material";
import {
  useDerivedNotesAtom,
  useSetOpenItem,
} from "pages/games/gamePageLayout/atoms/notes.atom";
import { useTranslation } from "react-i18next";
import { GUIDE_NOTE_FOLDER_NAME } from "api-calls/notes/_getRef";
import { useUID } from "atoms/auth.atom";
import {
  CampaignPermissionType,
  useCampaignPermissions,
} from "pages/games/gamePageLayout/hooks/usePermissions";
import { FAKE_ROOT_NOTE_FOLDER_KEY } from "./FolderView/rootNodeName";
import { getItemName } from "./FolderView/getFolderName";

interface BreadcrumbItem {
  type: "folder" | "note";
  id: string;
  name: string;
}

export function NoteBreadcrumbs() {
  const { t } = useTranslation();

  const uid = useUID();

  const setOpenItem = useSetOpenItem();

  const { campaignType, campaignPermission } = useCampaignPermissions();
  const hasCampaignNoteChildren = useDerivedNotesAtom(
    (store) =>
      Object.values(store.notes.notes).some(
        (note) => note.parentFolderId === GUIDE_NOTE_FOLDER_NAME,
      ) ||
      Object.values(store.folders.folders).some(
        (folder) => folder.parentFolderId === GUIDE_NOTE_FOLDER_NAME,
      ),
  );

  console.debug(campaignPermission, campaignType, hasCampaignNoteChildren);
  let hasAccessToMoreThanOneTopLevelFolder = false;
  if (
    (campaignPermission === CampaignPermissionType.Guide &&
      campaignType !== "solo") ||
    hasCampaignNoteChildren
  ) {
    hasAccessToMoreThanOneTopLevelFolder = true;
  }
  console.debug(hasAccessToMoreThanOneTopLevelFolder);

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
                ? store.folders.folders[item.folderId].name
                : store.notes.notes[item.noteId].title,
          });
        }

        const parentFolderId =
          item.type === "folder"
            ? store.folders.folders[item.folderId].parentFolderId
            : store.notes.notes[item.noteId].parentFolderId;
        const parentFolder = parentFolderId
          ? store.folders.folders[parentFolderId]
          : undefined;
        item =
          parentFolder && parentFolderId
            ? { type: "folder", folderId: parentFolderId }
            : undefined;
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

  // TODO - if player is a guide and this is not a solo game OR notes already exist, show a dropdown on the first breadcrumb to allow switching between user and guide notes

  if (breadcrumbItems.length > 0) {
    return (
      <>
        <Breadcrumbs>
          {breadcrumbItems.map((item, index) =>
            index === breadcrumbItems.length - 1 ? (
              <Typography>
                {getItemName({
                  name: item.name,
                  id: item.id,
                  uid,
                  t,
                })}
              </Typography>
            ) : (
              <Link
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
