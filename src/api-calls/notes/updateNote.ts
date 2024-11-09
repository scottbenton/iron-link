import { projectId } from "config/firebase.config";
import { Bytes, setDoc, updateDoc } from "firebase/firestore";

import {
  constructNoteContentPath,
  constructNoteDocPath,
  getNoteContentDocument,
  getNoteDocument,
} from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const updateNote = createApiFunction<
  {
    campaignId: string;
    noteId: string;
    title: string;
    content?: Uint8Array;
    isBeaconRequest?: boolean;
  },
  void
>((params) => {
  const { campaignId, noteId, title, content, isBeaconRequest } = params;

  return new Promise((resolve, reject) => {
    const noteContentPath = constructNoteContentPath(campaignId, noteId);
    const noteDocPath = constructNoteDocPath(campaignId, noteId);

    // If we are making this call when closing the page, we want to use a fetch call with keepalive
    if (isBeaconRequest) {
      const contentPath = `projects/${projectId}/databases/(default)/documents${noteContentPath}`;
      const titlePath = `projects/${projectId}/databases/(default)/documents${noteDocPath}`;

      const token = window.sessionStorage.getItem("id-token") ?? "";

      if (content) {
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
      }
      fetch(
        `https://firestore.googleapis.com/v1/${titlePath}?updateMask.fieldPaths=title`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: titlePath,
            fields: {
              title: {
                stringValue: title,
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
        updateDoc(getNoteDocument(campaignId, noteId), {
          title,
        }),
      );

      if (content) {
        promises.push(
          setDoc(
            getNoteContentDocument(campaignId, noteId),
            {
              notes: Bytes.fromUint8Array(content),
            },
            { merge: true },
          ),
        );
      }

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
