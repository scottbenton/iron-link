import { Editor as TTEditor, useEditor } from "@tiptap/react";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";

import { useAuthStore } from "stores/auth.store";

import { Editor } from "./Editor";
import { rtcExtensions } from "./rtcExtensions";

export interface RtcRichTextEditorProps {
  provider: WebrtcProvider;
  doc: Y.Doc;
  saving: boolean;
  readOnly?: boolean;
  Toolbar: React.FC<{ editor: TTEditor }>;
}

export function RtcEditorComponent(props: RtcRichTextEditorProps) {
  const { provider, doc, saving, readOnly, Toolbar } = props;

  const { uid, displayName } = useAuthStore((store) => ({
    uid: store.user?.uid,
    displayName: store.user?.displayName,
  }));

  const editor = useEditor(
    {
      extensions: rtcExtensions({
        doc,
        provider,
        userId: uid,
        userName: displayName,
      }),
      editable: !readOnly,
    },
    [doc, provider, uid, displayName],
  );

  return (
    <Editor
      editable={!readOnly}
      editor={editor}
      saving={saving}
      Toolbar={Toolbar}
    />
  );
}
