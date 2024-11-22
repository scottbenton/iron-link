import { useSortable } from "@dnd-kit/sortable";
import { Card } from "@mui/material";

import { NoteItemContent } from "./NoteItem";
import { CSS } from "@dnd-kit/utilities";
import { NoteDocument } from "api-calls/notes/_notes.type";

export interface SortableNoteItemProps {
  id: string;
  note: NoteDocument;
}

export function SortableNoteItem(props: SortableNoteItemProps) {
  const { id, note } = props;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      variant={"outlined"}
      key={id}
      sx={{ mt: 1 }}
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <NoteItemContent id={id} note={note} />
    </Card>
  );
}
