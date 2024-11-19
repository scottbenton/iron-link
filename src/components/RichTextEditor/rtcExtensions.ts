import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { Extensions } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { User } from "firebase/auth";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";

import { getHueFromString, hslToHex } from "lib/getHueFromString";

export const rtcExtensions = (params: {
  doc?: Y.Doc;
  provider?: WebrtcProvider;
  user?: User;
}) => {
  const userColor = hslToHex(getHueFromString(params.user?.uid ?? ""), 70, 80);
  const { doc, provider, user } = params;
  const extensions: Extensions = [
    StarterKit.configure({
      history: false,
    }),
    Collaboration.configure({ document: doc }),
    CollaborationCursor.configure({
      provider: provider,
      user: {
        name: user?.displayName ?? "Unknown User",
        color: user ? userColor : "#d0d0d0",
      },
    }),
  ];

  return extensions;
};
