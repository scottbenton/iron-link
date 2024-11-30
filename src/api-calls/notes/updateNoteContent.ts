import { Bytes, setDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";

import { projectId } from "config/firebase.config";

import { constructNoteContentPath, getNoteContentDocument } from "./_getRef";

export const updateNoteContent = createApiFunction<
  {
    campaignId: string;
    noteId: string;
    content: Uint8Array;
    isBeaconRequest?: boolean;
  },
  void
>((params) => {
  const { campaignId, noteId, content, isBeaconRequest } = params;

  return new Promise((resolve, reject) => {
    const noteContentPath = constructNoteContentPath(campaignId, noteId);

    // If we are making this call when closing the page, we want to use a fetch call with keepalive
    if (isBeaconRequest) {
      const contentPath = `projects/${projectId}/databases/(default)/documents${noteContentPath}`;

      const token = window.sessionStorage.getItem("id-token") ?? "";

      fetch(
        `https://firestore.googleapis.com/v1/${contentPath}?updateMask.fieldPaths=notes`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: contentPath,
            fields: {
              notes: {
                bytesValue: Bytes.fromUint8Array(content).toBase64(),
              },
            },
          }),
          keepalive: true,
        },
      ).catch((e) => console.error(e));

      resolve();
    } else {
      const promises: Promise<unknown>[] = [];

      promises.push(
        setDoc(
          getNoteContentDocument(campaignId, noteId),
          {
            notes: Bytes.fromUint8Array(content),
          },
          { merge: true },
        ),
      );

      Promise.all(promises)
        .then(() => {
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    }
  });
}, "Failed to update note.");
