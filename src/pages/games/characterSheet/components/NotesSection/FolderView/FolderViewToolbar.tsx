import { useState } from "react";
import { useTranslation } from "react-i18next";
import FolderIcon from "@mui/icons-material/CreateNewFolder";
import RenameIcon from "@mui/icons-material/DriveFileRenameOutline";
import DocumentIcon from "@mui/icons-material/NoteAdd";
import { Box, Button, IconButton, Tooltip } from "@mui/material";

import { NoteToolbar } from "../Layout";
import { useFolderPermission } from "../NoteView/useFolderPermissions";
import { ShareButton } from "../ShareButton";
import { FolderDeleteButton } from "./FolderDeleteButton";
import { NameItemDialog } from "./NameItemDialog";
import { FAKE_ROOT_NOTE_FOLDER_KEY } from "./rootNodeName";
import { addFolder } from "api-calls/notes/addFolder";
import { addNote } from "api-calls/notes/addNote";
import { updateNoteFolder } from "api-calls/notes/updateNoteFolder";
import { useUID } from "atoms/auth.atom";
import { useDerivedNotesAtom } from "pages/games/gamePageLayout/atoms/notes.atom";
import { useCampaignId } from "pages/games/gamePageLayout/hooks/useCampaignId";

export interface FolderViewToolbarProps {
  folderId: string;
}

export function FolderViewToolbar(props: FolderViewToolbarProps) {
  const { folderId } = props;
  const { t } = useTranslation();

  const uid = useUID();
  const campaignId = useCampaignId();

  const folder = useDerivedNotesAtom(
    (notes) => {
      return notes.folders.folders[folderId];
    },
    [folderId],
  );
  const parentFolderId = folder?.parentFolderId;

  const parentFolder = useDerivedNotesAtom(
    (notes) => {
      return parentFolderId ? notes.folders.folders[parentFolderId] : undefined;
    },
    [parentFolderId],
  );

  const isImmutableFolder = !folder?.parentFolderId;

  const [nameItemDialogSettings, setNameItemDialogSettings] = useState<{
    open: boolean;
    type: "folder" | "note";
    renamingCurrent?: boolean;
  }>({ open: false, type: "folder" });

  const { canDelete, isInGuideFolder } = useFolderPermission(folderId);

  // Something's gone wrong, lets stop before we break things
  if (!folder || folderId === FAKE_ROOT_NOTE_FOLDER_KEY) return null;

  const createFolder = (name: string) => {
    addFolder({
      uid,
      campaignId,
      parentFolderId: folderId,
      name,
      order: 1,
      readPermissions: { ...folder.readPermissions, inherited: true },
      editPermissions: {
        ...folder.editPermissions,
        inherited: true,
      },
    }).catch(() => {});
  };

  const createNote = (name: string) => {
    addNote({
      uid,
      campaignId,
      parentFolderId: folderId,
      title: name,
      order: 1,
    }).catch(() => {});
  };

  const renameCurrentFolder = (name: string) => {
    updateNoteFolder({
      campaignId,
      folderId,
      noteFolder: {
        name,
      },
    }).catch(() => {});
  };

  return (
    <NoteToolbar>
      {!isImmutableFolder && (
        <Tooltip title={t("notes.toolbar.rename-folder", "Rename Folder")}>
          <IconButton
            onClick={() =>
              setNameItemDialogSettings({
                open: true,
                type: "folder",
                renamingCurrent: true,
              })
            }
          >
            <RenameIcon />
          </IconButton>
        </Tooltip>
      )}
      {!isImmutableFolder && parentFolder && parentFolderId && (
        <ShareButton
          item={{ type: "folder", id: folderId, ownerId: folder.creator }}
          currentPermissions={{
            writePermissions: folder.editPermissions,
            viewPermissions: folder.readPermissions,
          }}
          parentFolder={{
            id: parentFolderId,
            name: parentFolder.name,
            writePermissions: parentFolder.editPermissions,
            viewPermissions: parentFolder.readPermissions,
          }}
          isInGMFolder={isInGuideFolder}
        />
      )}
      {!isImmutableFolder && canDelete && folder.parentFolderId && (
        <FolderDeleteButton
          parentFolderId={folder.parentFolderId}
          folderId={folderId}
          name={folder.name}
        />
      )}

      <Box flexGrow={1} display="flex" justifyContent="flex-end" gap={1}>
        <Tooltip title={t("notes.toolbar.create-folder", "Create Folder")}>
          <IconButton
            onClick={() =>
              setNameItemDialogSettings({
                open: true,
                type: "folder",
              })
            }
          >
            <FolderIcon />
          </IconButton>
        </Tooltip>
        <Button
          sx={{ justifySelf: "end" }}
          variant="contained"
          endIcon={<DocumentIcon />}
          onClick={() =>
            setNameItemDialogSettings({
              open: true,
              type: "note",
            })
          }
        >
          {t("notes.toolbar.create-note", "Create Note")}
        </Button>
      </Box>
      <NameItemDialog
        open={nameItemDialogSettings.open}
        itemLabel={
          nameItemDialogSettings.type === "folder"
            ? t("notes.folder", "Folder")
            : t("notes.note", "Note")
        }
        name={nameItemDialogSettings.renamingCurrent ? folder.name : ""}
        onSave={(name) => {
          if (nameItemDialogSettings.renamingCurrent) {
            renameCurrentFolder(name);
          } else if (nameItemDialogSettings.type === "folder") {
            createFolder(name);
          } else {
            createNote(name);
          }
        }}
        onClose={() =>
          setNameItemDialogSettings({ ...nameItemDialogSettings, open: false })
        }
      />
    </NoteToolbar>
  );
}
