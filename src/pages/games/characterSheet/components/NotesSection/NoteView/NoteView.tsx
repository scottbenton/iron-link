import { useCallback } from "react";

import { EmptyState } from "components/Layout/EmptyState";
import { RtcRichTextEditor } from "components/RichTextEditor";

import { useGameId } from "pages/games/gamePageLayout/hooks/useGameId";

import { useNotesStore } from "stores/notes.store";

import { NoteToolbar } from "../Layout";
import { NoteViewToolbar } from "./NoteViewToolbar";
import { useNotePermission } from "./useNotePermission";

export interface NoteViewProps {
  openNoteId: string;
}

export function NoteView(props: NoteViewProps) {
  const { openNoteId } = props;

  const gameId = useGameId();
  const updateNoteContent = useNotesStore((store) => store.updateNoteContent);

  const { noteContent, loading, error } = useNotesStore((store) => {
    if (!store.openItem || store.openItem.type === "folder") {
      return {
        noteContent: undefined,
        loading: false,
        error: "No note open",
      };
    } else {
      return {
        noteContent: store.openItem.noteContent.data?.notes,
        loading: store.openItem.noteContent.loading,
        error: store.openItem.noteContent.error,
      };
    }
  });

  const notePermissions = useNotePermission(openNoteId);

  const handleSave = useCallback(
    (documentId: string, notes: Uint8Array, isBeaconRequest?: boolean) => {
      return updateNoteContent(gameId, documentId, notes, isBeaconRequest);
    },
    [gameId, updateNoteContent],
  );

  if (error) {
    return <EmptyState message={error} />;
  }

  return (
    <>
      <RtcRichTextEditor
        id={openNoteId}
        roomPrefix={`notes-${gameId}-`}
        documentPassword={gameId}
        Toolbar={({ editor }) => (
          <NoteToolbar>
            {notePermissions.canEdit ? (
              <NoteViewToolbar
                editor={editor}
                openNoteId={openNoteId}
                permissions={notePermissions}
              />
            ) : undefined}
          </NoteToolbar>
        )}
        initialValue={noteContent}
        onSave={loading || !notePermissions.canEdit ? undefined : handleSave}
      />
    </>
  );
}
