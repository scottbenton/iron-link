import { useTranslation } from "react-i18next";
import DocIcon from "@mui/icons-material/Description";
import FolderIcon from "@mui/icons-material/Folder";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import { Card, CardActionArea, Divider, Typography } from "@mui/material";

import { OpenItemWrapper } from "../Layout";
import { getItemName } from "./getFolderName";
import { FAKE_ROOT_NOTE_FOLDER_KEY } from "./rootNodeName";
import { ReadPermissions } from "api-calls/notes/_notes.type";
import { useUID } from "atoms/auth.atom";
import { GridLayout } from "components/Layout";
import {
  useDerivedNotesAtom,
  useSetOpenItem,
} from "pages/games/gamePageLayout/atoms/notes.atom";
import { useCampaignPermissions } from "pages/games/gamePageLayout/hooks/usePermissions";

export interface FolderViewProps {
  folderId: string | undefined;
}
export function FolderView(props: FolderViewProps) {
  const { folderId } = props;

  const { t } = useTranslation();
  const uid = useUID();
  const campaignType = useCampaignPermissions().campaignType;

  const subFolders = useDerivedNotesAtom(
    (notes) => {
      if (!folderId) {
        return Object.entries(notes.folders.folders).filter(([, folder]) => {
          const parentId = folder.parentFolderId;
          if (parentId === null) {
            return false;
          }
          if (!notes.folders.folders[parentId]) {
            return true;
          }
          return false;
        });
      }
      if (folderId === FAKE_ROOT_NOTE_FOLDER_KEY) {
        return Object.entries(notes.folders.folders)
          .filter(
            ([fid, folder]) =>
              fid !== FAKE_ROOT_NOTE_FOLDER_KEY && !folder.parentFolderId,
          )
          .sort(([, a], [, b]) => a.name.localeCompare(b.name));
      }
      return Object.entries(notes.folders.folders)
        .filter(([, folder]) => folder.parentFolderId === folderId)
        .sort(([, a], [, b]) => a.name.localeCompare(b.name));
    },
    [folderId],
  );

  const notes = useDerivedNotesAtom(
    (notes) => {
      if (!folderId) {
        return Object.entries(notes.notes.notes).filter(([, note]) => {
          const parentFolderId = note.parentFolderId;
          const parentFolder = notes.folders.folders[parentFolderId];
          if (!parentFolder) {
            return true;
          }
          return false;
        });
      }
      return Object.entries(notes.notes.notes).filter(
        ([, note]) => note.parentFolderId === folderId,
      );
    },
    [folderId],
  );

  const setOpenItem = useSetOpenItem();

  return (
    <OpenItemWrapper sx={{ mx: -1 }}>
      {folderId === undefined &&
        (subFolders.length > 0 || notes.length > 0) && (
          <>
            <Divider sx={{ my: 1 }} />
            <Typography variant="overline" px={1}>
              {t("notes.shared-with-me", "Shared with you")}
            </Typography>
          </>
        )}
      {subFolders.length > 0 && (
        <GridLayout
          sx={{ mb: 1 }}
          gap={1}
          items={subFolders}
          minWidth={200}
          renderItem={([subFolderId, subFolder]) => (
            <Card
              variant={"outlined"}
              key={subFolderId}
              sx={{ bgcolor: "background.default" }}
            >
              <CardActionArea
                sx={{
                  py: 1.5,
                  px: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: 1,
                }}
                onClick={() =>
                  setOpenItem({ type: "folder", folderId: subFolderId })
                }
              >
                {subFolder.readPermissions !== ReadPermissions.OnlyAuthor ? (
                  <FolderSharedIcon color="action" />
                ) : (
                  <FolderIcon color="action" />
                )}
                <Typography>
                  {getItemName({
                    name: subFolder.name,
                    id: subFolderId,
                    uid,
                    t,
                    campaignType,
                  })}
                </Typography>
              </CardActionArea>
            </Card>
          )}
        />
      )}
      {notes.map(([noteId, note]) => (
        <Card variant={"outlined"} key={noteId} sx={{ mt: 1 }}>
          <CardActionArea
            sx={{
              py: 1.5,
              px: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 1,
            }}
            onClick={() => setOpenItem({ type: "note", noteId })}
          >
            <DocIcon sx={{ color: "primary.light" }} />
            <Typography>{note.title}</Typography>
          </CardActionArea>
        </Card>
      ))}
    </OpenItemWrapper>
  );
}
