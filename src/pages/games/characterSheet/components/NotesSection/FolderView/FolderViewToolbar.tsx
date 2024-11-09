import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import FolderIcon from "@mui/icons-material/CreateNewFolder";
import DocumentIcon from "@mui/icons-material/NoteAdd";
import { addFolder } from "api-calls/notes/addFolder";
import { useUID } from "atoms/auth.atom";
import { useCampaignId } from "pages/games/gamePageLayout/hooks/useCampaignId";
import { useDerivedNotesAtom } from "pages/games/gamePageLayout/atoms/notes.atom";
import { addNote } from "api-calls/notes/addNote";
import { NameItemDialog } from "./NameItemDialog";
import { useState } from "react";
import RenameIcon from "@mui/icons-material/DriveFileRenameOutline";
import { updateNoteFolder } from "api-calls/notes/updateNoteFolder";
import { FAKE_ROOT_NOTE_FOLDER_KEY } from "./rootNodeName";
import { NoteToolbar } from "../Layout";

export interface FolderViewToolbarProps {
  folderId: string;
}

export function FolderViewToolbar(props: FolderViewToolbarProps) {
  const { folderId } = props;
  const { t } = useTranslation();

  const uid = useUID();
  const campaignId = useCampaignId();

  console.debug(folderId);

  const folder = useDerivedNotesAtom(
    (notes) => {
      return notes.folders.folders[folderId];
    },
    [folderId],
  );

  const isImmutableFolder = !folder.parentFolderId;

  const [nameItemDialogSettings, setNameItemDialogSettings] = useState<{
    open: boolean;
    type: "folder" | "note";
    renamingCurrent?: boolean;
  }>({ open: false, type: "folder" });

  // Something's gone wrong, lets stop before we break things
  if (!folder || folderId === FAKE_ROOT_NOTE_FOLDER_KEY) return null;

  const createFolder = (name: string) => {
    addFolder({
      uid,
      campaignId,
      parentFolderId: folderId,
      name,
      order: 1,
      viewPermissions: { ...folder.viewPermissions, inherited: true },
      writePermissions: {
        ...folder.writePermissions,
        inherited: true,
      },
    }).catch(() => {});
  };

  const createNote = (name: string) => {
    console.log("createNote");
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

      <Box flexGrow={1} display="flex" justifyContent="flex-end">
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
