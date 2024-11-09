import { useCallback, useEffect, useMemo } from "react";
import { atom, useAtomValue, useSetAtom } from "jotai";

import { useCampaignId } from "../hooks/useCampaignId";
import { useDerivedCampaignState } from "../hooks/useDerivedCampaignState";
import { useCampaignPermissions } from "../hooks/usePermissions";
import {
  NoteContentDocument,
  NoteDocument,
  NoteFolder,
  ViewPermissions,
  WritePermissions,
} from "api-calls/notes/_notes.type";
import { listenToNoteFolders } from "api-calls/notes/listenToNoteFolders";
import { listenToNotes } from "api-calls/notes/listenToNotes";
import { useUID } from "atoms/auth.atom";
import { derivedAtomWithEquality } from "atoms/derivedAtomWithEquality";
import { FAKE_ROOT_NOTE_FOLDER_KEY } from "pages/games/characterSheet/components/NotesSection/FolderView/rootNodeName";

export interface INotesAtom {
  openItem?:
    | {
        type: "note";
        noteId: string;
        noteContent?: NoteContentDocument;
      }
    | {
        type: "folder";
        folderId: string;
      };

  notes: {
    notes: Record<string, NoteDocument>;
    loading: boolean;
    error?: string;
  };
  folders: {
    folders: Record<string, NoteFolder>;
    loading: boolean;
    error?: string;
  };
}

export const defaultNotesAtom: INotesAtom = {
  openItem: undefined,
  notes: {
    loading: true,
    notes: {},
  },
  folders: {
    loading: true,
    folders: {},
  },
};

export const notesAtom = atom<INotesAtom>(defaultNotesAtom);

export function useDerivedNotesAtom<T>(
  select: (atom: INotesAtom) => T,
  deps?: unknown[],
): T {
  return useAtomValue(
    useMemo(
      () =>
        derivedAtomWithEquality(notesAtom, (notesAtom) => select(notesAtom)),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      deps ?? [],
    ),
  );
}

export function useSetNotesAtom() {
  return useSetAtom(notesAtom);
}

export function useSetOpenItem() {
  const setAtom = useSetNotesAtom();
  return useCallback(
    (openItem: INotesAtom["openItem"]) => {
      setAtom((prev) => ({
        ...prev,
        openItem,
      }));
    },
    [setAtom],
  );
}

export function useSyncNotes() {
  const uid = useUID();
  const campaignId = useCampaignId();

  const campaignLoading = useDerivedCampaignState((state) => state.loading);
  const { campaignPermission } = useCampaignPermissions();

  const setNotesAtom = useSetNotesAtom();

  const noteFoldersToSync = useDerivedNotesAtom((notesAtom) =>
    Object.keys(notesAtom.folders.folders),
  );

  useEffect(() => {
    if (!campaignLoading) {
      const unsubscribe = listenToNoteFolders(
        uid,
        campaignId,
        campaignPermission,
        (folders) => {
          setNotesAtom((prev) => ({
            ...prev,
            folders: {
              loading: false,
              folders: {
                ...folders,
                [FAKE_ROOT_NOTE_FOLDER_KEY]: {
                  name: FAKE_ROOT_NOTE_FOLDER_KEY,
                  parentFolderId: null,
                  creator: "",
                  order: 0,
                  viewPermissions: {
                    type: ViewPermissions.OnlyGuides,
                    inherited: false,
                  },
                  writePermissions: {
                    type: WritePermissions.OnlyGuides,
                    inherited: false,
                  },
                },
              },
              error: undefined,
            },
          }));
        },
        (error) => {
          console.error(error);
          setNotesAtom((prev) => ({
            ...prev,
            campaignNotes: {
              loading: false,
              error: "Failed to load notes",
              notes: {},
            },
          }));
        },
      );

      return unsubscribe;
    }
  }, [campaignPermission, uid, campaignId, campaignLoading, setNotesAtom]);

  useEffect(() => {
    if (!campaignLoading) {
      const unsubscribe = listenToNotes(
        uid,
        campaignId,
        campaignPermission,
        noteFoldersToSync,
        (notes) => {
          setNotesAtom((prev) => ({
            ...prev,
            notes: {
              loading: false,
              notes,
              error: undefined,
            },
          }));
        },
        (error) => {
          console.error(error);
          setNotesAtom((prev) => ({
            ...prev,
            notes: {
              loading: false,
              error: "Failed to load notes",
              notes: {},
            },
          }));
        },
      );

      return () => {
        unsubscribe();
      };
    }
  }, [
    campaignLoading,
    campaignPermission,
    uid,
    campaignId,
    setNotesAtom,
    noteFoldersToSync,
  ]);

  useEffect(() => {
    return () => {
      setNotesAtom(defaultNotesAtom);
    };
  }, [campaignId, setNotesAtom]);
}
