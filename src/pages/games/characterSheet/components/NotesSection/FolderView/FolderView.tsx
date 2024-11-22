import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import FolderIcon from "@mui/icons-material/Folder";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import { Card, CardActionArea, Divider, Typography } from "@mui/material";

import { getItemName } from "./getFolderName";
import { NoteItem } from "./NoteItem";
import { FAKE_ROOT_NOTE_FOLDER_KEY } from "./rootNodeName";
import { SortableNoteItem } from "./SortableNoteItem";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { NoteDocument, ReadPermissions } from "api-calls/notes/_notes.type";
import { updateNoteOrder } from "api-calls/notes/updateNoteOrder";
import { useUID } from "atoms/auth.atom";
import { GridLayout } from "components/Layout";
import {
  useDerivedNotesAtom,
  useSetOpenItem,
} from "pages/games/gamePageLayout/atoms/notes.atom";
import { useCampaignId } from "pages/games/gamePageLayout/hooks/useCampaignId";
import { useCampaignPermissions } from "pages/games/gamePageLayout/hooks/usePermissions";

export interface FolderViewProps {
  folderId: string | undefined;
}
export function FolderView(props: FolderViewProps) {
  const { folderId } = props;

  const { t } = useTranslation();
  const uid = useUID();
  const campaignId = useCampaignId();
  const campaignType = useCampaignPermissions().campaignType;

  const subFolders = useDerivedNotesAtom(
    (notes) => {
      if (!folderId) {
        return Object.entries(notes.folders.folders).filter(([, folder]) => {
          const parentId = folder.parentFolderId;
          if (parentId === null) {
            return false;
          }
          if (!notes.folders.folders[parentId]) {
            return true;
          }
          return false;
        });
      }
      if (folderId === FAKE_ROOT_NOTE_FOLDER_KEY) {
        return Object.entries(notes.folders.folders)
          .filter(
            ([fid, folder]) =>
              fid !== FAKE_ROOT_NOTE_FOLDER_KEY && !folder.parentFolderId,
          )
          .sort(([, a], [, b]) => a.name.localeCompare(b.name));
      }
      return Object.entries(notes.folders.folders)
        .filter(([, folder]) => folder.parentFolderId === folderId)
        .sort(([, a], [, b]) => a.name.localeCompare(b.name));
    },
    [folderId],
  );

  const { sortedNoteIds, noteMap } = useDerivedNotesAtom(
    (notes) => {
      const sortedNoteIds: string[] = [];
      const noteMap: Record<string, NoteDocument> = {};

      if (!folderId) {
        Object.entries(notes.notes.notes).forEach(([noteId, note]) => {
          const parentFolderId = note.parentFolderId;
          const parentFolder = notes.folders.folders[parentFolderId];
          if (!parentFolder) {
            sortedNoteIds.push(noteId);
            noteMap[noteId] = note;
          }
        });
      } else {
        Object.entries(notes.notes.notes).forEach(([noteId, note]) => {
          if (note.parentFolderId === folderId) {
            sortedNoteIds.push(noteId);
            noteMap[noteId] = note;
          }
        });
      }

      sortedNoteIds.sort((a, b) => {
        if (folderId) {
          return noteMap[a].order - noteMap[b].order;
        } else {
          return noteMap[a].title.localeCompare(noteMap[b].title);
        }
      });

      return {
        sortedNoteIds,
        noteMap,
      };
    },
    [folderId],
  );

  // localally sorted nodes allows us to show updates immediately
  const [localSortedNodes, setLocalSortedNodes] = useState(sortedNoteIds);
  useEffect(() => {
    setLocalSortedNodes(sortedNoteIds);
  }, [sortedNoteIds]);

  const setOpenItem = useSetOpenItem();

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const activeId = event.active.id as string;
      const overId = event.over?.id as string;

      if (!overId) {
        return;
      }

      if (activeId !== overId) {
        // Find the index of the new position
        const overIndex = localSortedNodes.indexOf(overId);
        const activeIndex = localSortedNodes.indexOf(activeId);

        if (overIndex < 0 || activeIndex < 0) {
          return;
        }

        const overOrder = noteMap[overId].order;
        let otherSideOrder: number;
        if (overIndex > activeIndex) {
          // We are moving the note back in the list, so we need the note after's order
          otherSideOrder =
            overIndex + 1 === localSortedNodes.length
              ? overOrder + 2
              : noteMap[localSortedNodes[overIndex + 1]].order;
        } else {
          // We are moving the note forward in the list, so we need the note before's order
          otherSideOrder =
            overIndex === 0
              ? overOrder - 2
              : noteMap[localSortedNodes[overIndex - 1]].order;
        }
        const updatedOrder = (overOrder + otherSideOrder) / 2;

        // Setting this locally so we can update the UI immediately
        setLocalSortedNodes((prev) => {
          return arrayMove(prev, activeIndex, overIndex);
        });

        updateNoteOrder({
          campaignId,
          noteId: activeId,
          order: updatedOrder,
        });
      }
    },
    [campaignId, noteMap, localSortedNodes],
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <>
      {folderId === undefined &&
        (subFolders.length > 0 || sortedNoteIds.length > 0) && (
          <>
            <Divider sx={{ my: 1 }} />
            <Typography variant="overline" px={1}>
              {t("notes.shared-with-me", "Shared with you")}
            </Typography>
          </>
        )}
      {subFolders.length > 0 && (
        <GridLayout
          sx={{ mb: 1 }}
          gap={1}
          items={subFolders}
          minWidth={200}
          renderItem={([subFolderId, subFolder]) => (
            <Card
              variant={"outlined"}
              key={subFolderId}
              sx={{ bgcolor: "background.default" }}
            >
              <CardActionArea
                sx={{
                  py: 1.5,
                  px: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: 1,
                }}
                onClick={() =>
                  setOpenItem({ type: "folder", folderId: subFolderId })
                }
              >
                {subFolder.readPermissions !== ReadPermissions.OnlyAuthor ? (
                  <FolderSharedIcon color="action" />
                ) : (
                  <FolderIcon color="action" />
                )}
                <Typography>
                  {getItemName({
                    name: subFolder.name,
                    id: subFolderId,
                    uid,
                    t,
                    campaignType,
                  })}
                </Typography>
              </CardActionArea>
            </Card>
          )}
        />
      )}
      {folderId ? (
        <DndContext
          collisionDetection={closestCenter}
          sensors={sensors}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedNoteIds}
            strategy={verticalListSortingStrategy}
          >
            {sortedNoteIds.map((noteId) => (
              <SortableNoteItem
                key={noteId}
                id={noteId}
                note={noteMap[noteId]}
              />
            ))}
          </SortableContext>
        </DndContext>
      ) : (
        <>
          {sortedNoteIds.map((noteId) => (
            <NoteItem key={noteId} id={noteId} note={noteMap[noteId]} />
          ))}
        </>
      )}
    </>
  );
}
