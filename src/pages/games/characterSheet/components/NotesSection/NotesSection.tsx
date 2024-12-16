import { LinearProgress } from "@mui/material";

import { useUID } from "stores/auth.store";
import { useNotesStore } from "stores/notes.store";

import { DefaultNoteChooser } from "./DefaultNoteChooser";
import { FolderView, FolderViewToolbar } from "./FolderView";
import { OpenItemWrapper } from "./Layout";
import { NoteView } from "./NoteView";

export function NotesSection() {
  const areBasicNotesLoading = useNotesStore(
    (store) => store.folderState.loading || store.noteState.loading,
  );

  const uid = useUID();

  const openItem = useNotesStore((store) => store.openItem);

  if (areBasicNotesLoading) {
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
