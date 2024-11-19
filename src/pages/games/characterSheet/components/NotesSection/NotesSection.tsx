import { LinearProgress } from "@mui/material";

import { DefaultNoteChooser } from "./DefaultNoteChooser";
import { FolderView, FolderViewToolbar } from "./FolderView";
import { NoteView } from "./NoteView";
import { useUID } from "atoms/auth.atom";
import { useDerivedNotesAtom } from "pages/games/gamePageLayout/atoms/notes.atom";

export function NotesSection() {
  const areAnyNotesLoading = useDerivedNotesAtom((notes) => {
    return notes.notes.loading || notes.folders.loading;
  });

  const uid = useUID();

  const openItem = useDerivedNotesAtom((notes) => notes.openItem);

  if (areAnyNotesLoading) {
    return <LinearProgress />;
  }

  return (
    <>
      <DefaultNoteChooser />
      {openItem?.type === "folder" && (
        <>
          <FolderViewToolbar folderId={openItem.folderId} />
          <FolderView folderId={openItem.folderId} />
          {openItem.folderId === uid && <FolderView folderId={undefined} />}
        </>
      )}
      {openItem?.type === "note" && <NoteView openNoteId={openItem.noteId} />}
    </>
  );
}
