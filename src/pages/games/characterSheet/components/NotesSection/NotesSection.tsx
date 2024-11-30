import { LinearProgress } from "@mui/material";

import { useDerivedNotesAtom } from "pages/games/gamePageLayout/atoms/notes.atom";

import { useUID } from "atoms/auth.atom";

import { DefaultNoteChooser } from "./DefaultNoteChooser";
import { FolderView, FolderViewToolbar } from "./FolderView";
import { OpenItemWrapper } from "./Layout";
import { NoteView } from "./NoteView";

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
          <OpenItemWrapper sx={{ mx: -1, flexGrow: 1 }}>
            <FolderView folderId={openItem.folderId} />
            {openItem.folderId === uid && <FolderView folderId={undefined} />}
          </OpenItemWrapper>
        </>
      )}
      {openItem?.type === "note" && <NoteView openNoteId={openItem.noteId} />}
    </>
  );
}
