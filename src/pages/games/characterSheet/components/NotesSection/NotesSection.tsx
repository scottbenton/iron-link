import { Box, LinearProgress } from "@mui/material";

import { DefaultNoteChooser } from "./DefaultNoteChooser";
import { FolderView, FolderViewToolbar } from "./FolderView";
import { NoteBreadcrumbs } from "./NoteBreadcrumbs";
import { NoteView } from "./NoteView";
import { useDerivedNotesAtom } from "pages/games/gamePageLayout/atoms/notes.atom";

export function NotesSection() {
  const areAnyNotesLoading = useDerivedNotesAtom((notes) => {
    return notes.notes.loading || notes.folders.loading;
  });

  const openItem = useDerivedNotesAtom((notes) => notes.openItem);

  if (areAnyNotesLoading) {
    return <LinearProgress />;
  }

  return (
    <>
      <DefaultNoteChooser />
      <Box px={1.5}>
        <NoteBreadcrumbs />
      </Box>
      {openItem?.type === "folder" && (
        <>
          <FolderViewToolbar folderId={openItem.folderId} />
          <FolderView folderId={openItem.folderId} />
        </>
      )}
      {openItem?.type === "note" && <NoteView openNoteId={openItem.noteId} />}
    </>
  );
}
