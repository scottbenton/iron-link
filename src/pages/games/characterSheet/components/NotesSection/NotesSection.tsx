import { Box, LinearProgress } from "@mui/material";

import { DefaultNoteChooser } from "./DefaultNoteChooser";
import { NoteBreadcrumbs } from "./NoteBreadcrumbs";
import { useDerivedNotesAtom } from "pages/games/gamePageLayout/atoms/notes.atom";
import { FolderView, FolderViewToolbar } from "./FolderView";

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
        <FolderViewToolbar folderId={openItem.folderId} />
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          overflow: "auto",
          px: 0.5,
        }}
      >
        <Box px={1} pt={1}>
          {openItem?.type === "note" && "Note"}
          {openItem?.type === "folder" && (
            <FolderView folderId={openItem.folderId} />
          )}
        </Box>
      </Box>
    </>
  );
}
