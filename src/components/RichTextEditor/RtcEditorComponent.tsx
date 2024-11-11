import { Editor as TTEditor, useEditor } from "@tiptap/react";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";

import { Editor } from "./Editor";
import { rtcExtensions } from "./rtcExtensions";
import { useAuthAtom } from "atoms/auth.atom";

export interface RtcRichTextEditorProps {
  provider: WebrtcProvider;
  doc: Y.Doc;
  saving: boolean;
  readOnly?: boolean;
  Toolbar: React.FC<{ editor: TTEditor }>;
}

export function RtcEditorComponent(props: RtcRichTextEditorProps) {
  const { provider, doc, saving, readOnly, Toolbar } = props;

  const user = useAuthAtom()[0].user;

  const editor = useEditor(
    {
      extensions: rtcExtensions({
        doc,
        provider,
        user,
      }),
      editable: !readOnly,
    },
    [doc, provider, user],
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
