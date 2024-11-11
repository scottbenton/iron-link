import { useCallback } from "react";

import { NoteToolbar } from "../Layout";
import { NoteViewToolbar } from "./NoteViewToolbar";
import { useNotePermission } from "./useNotePermission";
import { updateNoteContent } from "api-calls/notes/updateNoteContent";
import { EmptyState } from "components/Layout/EmptyState";
import { RtcRichTextEditor } from "components/RichTextEditor";
import { useListenToActiveNoteContent } from "pages/games/gamePageLayout/atoms/notes.atom";
import { useCampaignId } from "pages/games/gamePageLayout/hooks/useCampaignId";

export interface NoteViewProps {
  openNoteId: string;
}

export function NoteView(props: NoteViewProps) {
  const { openNoteId } = props;

  const campaignId = useCampaignId();

  const { noteContent, loading, error } =
    useListenToActiveNoteContent(openNoteId);

  const notePermissions = useNotePermission(openNoteId);

  const handleSave = useCallback(
    (documentId: string, notes: Uint8Array, isBeaconRequest?: boolean) => {
      return updateNoteContent({
        campaignId,
        noteId: documentId,
        content: notes,
        isBeaconRequest,
      });
    },
    [campaignId],
  );

  if (error) {
    return <EmptyState message={error} />;
  }

  return (
    <>
      <RtcRichTextEditor
        id={openNoteId}
        roomPrefix={`notes-${campaignId}-`}
        documentPassword={campaignId}
        Toolbar={({ editor }) => (
          <NoteToolbar>
            <NoteViewToolbar
              editor={editor}
              openNoteId={openNoteId}
              permissions={notePermissions}
            />
          </NoteToolbar>
        )}
        initialValue={noteContent}
        onSave={loading || !notePermissions.canEdit ? undefined : handleSave}
      />
    </>
  );
}
