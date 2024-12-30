import DeleteIcon from "@mui/icons-material/Delete";
import RenameIcon from "@mui/icons-material/DriveFileRenameOutline";
import BoldIcon from "@mui/icons-material/FormatBold";
import ItalicIcon from "@mui/icons-material/FormatItalic";
import BulletListIcon from "@mui/icons-material/FormatListBulleted";
import NumberedListIcon from "@mui/icons-material/FormatListNumbered";
import QuoteIcon from "@mui/icons-material/FormatQuote";
import StrikeThroughIcon from "@mui/icons-material/FormatStrikethrough";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import {
  Box,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import { Editor } from "@tiptap/react";
import { useConfirm } from "material-ui-confirm";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { useGameId } from "pages/games/gamePageLayout/hooks/useGameId";

import { useNotesStore } from "stores/notes.store";

import { NameItemDialog } from "../FolderView/NameItemDialog";
import { ShareButton } from "../ShareButton";
import { TextTypeDropdown } from "./TextTypeDropdown";
import { NotePermissions, useNotePermission } from "./useNotePermission";

export interface NoteToolbarContentProps {
  openNoteId: string;
  editor: Editor;
  permissions: NotePermissions;
}

export function NoteViewToolbar(props: NoteToolbarContentProps) {
  const { openNoteId, editor, permissions } = props;

  const { t } = useTranslation();
  const gameId = useGameId();

  const setOpenNote = useNotesStore((store) => store.setOpenItem);
  const note = useNotesStore((store) => {
    return store.noteState.notes[openNoteId];
  });
  const noteName = note.title;
  const { isInGuideFolder } = useNotePermission(openNoteId);

  const parentFolderId = useNotesStore((store) => {
    return store.noteState.notes[openNoteId].parentFolderId;
  });
  const parentFolder = useNotesStore((store) =>
    parentFolderId ? store.folderState.folders[parentFolderId] : undefined,
  );

  const confirm = useConfirm();

  const deleteNote = useNotesStore((store) => store.deleteNote);
  const handleDelete = useCallback(() => {
    confirm({
      title: t("notes.confirm-note-delete-title", "Delete {{noteName}}", {
        noteName,
      }),
      description: t(
        "notes.confirm.note-delete.description",
        "Are you sure you want to delete this note?",
      ),
      confirmationText: t("common.delete", "Delete"),
    })
      .then(() => {
        setOpenNote("folder", parentFolderId);
        deleteNote(gameId, openNoteId).catch(() => {});
      })
      .catch(() => {});
  }, [
    confirm,
    gameId,
    deleteNote,
    openNoteId,
    t,
    setOpenNote,
    parentFolderId,
    noteName,
  ]);

  const [openRenameDialog, setOpenRenameDialog] = useState(false);
  const handleRename = useCallback(() => {
    setOpenRenameDialog(true);
  }, []);

  const updateNoteName = useNotesStore((store) => store.updateNoteName);
  const renameNote = useCallback(
    (noteName: string) => {
      updateNoteName(gameId, openNoteId, noteName).catch(() => {});
    },
    [updateNoteName, gameId, openNoteId],
  );

  return (
    <>
      <TextTypeDropdown editor={editor} />
      <ToggleButtonGroup sx={{ mr: 1 }}>
        <Tooltip title={t("note.editor-toolbar.bold", "Bold")} enterDelay={300}>
          <ToggleButton
            size={"small"}
            value={"bold"}
            onClick={() => editor.chain().focus().toggleBold().run()}
            selected={editor.isActive("bold")}
          >
            <BoldIcon />
          </ToggleButton>
        </Tooltip>

        <Tooltip
          title={t("note.editor-toolbar.italic", "Italic")}
          enterDelay={300}
        >
          <ToggleButton
            size={"small"}
            value={"italic"}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            selected={editor.isActive("italic")}
          >
            <ItalicIcon />
          </ToggleButton>
        </Tooltip>

        <Tooltip
          title={t("note.editor-toolbar.strikethrough", "Strikethrough")}
          enterDelay={300}
        >
          <ToggleButton
            size={"small"}
            value={"strikethrough"}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            selected={editor.isActive("strike")}
          >
            <StrikeThroughIcon />
          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>
      <ToggleButtonGroup sx={{ mr: 1 }}>
        <Tooltip
          title={t("note.editor-toolbar.bulleted-list", "Bulleted List")}
          enterDelay={300}
        >
          <ToggleButton
            size={"small"}
            value={"bullet list"}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            selected={editor.isActive("bulletList")}
          >
            <BulletListIcon />
          </ToggleButton>
        </Tooltip>
        <Tooltip
          title={t("note.editor-toolbar.numbered-list", "Numbered List")}
          enterDelay={300}
        >
          <ToggleButton
            size={"small"}
            value={"number list"}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            selected={editor.isActive("orderedList")}
          >
            <NumberedListIcon />
          </ToggleButton>
        </Tooltip>
        <Tooltip
          title={t("note.editor-toolbar.horizontal-line", "Horizontal Line")}
          enterDelay={300}
        >
          <ToggleButton
            size={"small"}
            value={"horizontal rule"}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <HorizontalRuleIcon />
          </ToggleButton>
        </Tooltip>
        <Tooltip
          title={t("note.editor-toolbar.quote", "Quote")}
          enterDelay={300}
        >
          <ToggleButton
            size={"small"}
            value={"quote"}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <QuoteIcon />
          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>
      <Box display="flex" alignItems="center">
        <Tooltip
          title={t("note.editor-toolbar.rename-note", "Rename Note")}
          enterDelay={300}
        >
          <IconButton onClick={handleRename}>
            <RenameIcon />
          </IconButton>
        </Tooltip>
        <NameItemDialog
          open={openRenameDialog}
          onClose={() => setOpenRenameDialog(false)}
          onSave={renameNote}
          itemLabel="Note"
          name={noteName}
        />
        {parentFolder && parentFolderId && (
          <ShareButton
            item={{
              type: "note",
              id: openNoteId,
              ownerId: note.creator,
            }}
            currentPermissions={{
              editPermissions:
                note.editPermissions ?? parentFolder.editPermissions,
              readPermissions:
                note.readPermissions ?? parentFolder.readPermissions,
            }}
            parentFolder={{
              id: parentFolderId,
              name: parentFolder.name,
              editPermissions: parentFolder.editPermissions,
              readPermissions: parentFolder.readPermissions,
              isRootPlayerFolder: parentFolder.isRootPlayerFolder,
            }}
            isInGMFolder={isInGuideFolder}
          />
        )}
        {permissions.canDelete && (
          <Tooltip
            title={t("note.editor-toolbar.delete-note", "Delete Note")}
            enterDelay={300}
          >
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </>
  );
}
