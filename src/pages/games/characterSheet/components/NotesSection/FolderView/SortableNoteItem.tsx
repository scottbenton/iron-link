import { useSortable } from "@dnd-kit/sortable";
import DragOrderIcon from "@mui/icons-material/DragIndicator";
import { Box, Card } from "@mui/material";

import { NoteItemContent } from "./NoteItem";
import { CSS } from "@dnd-kit/utilities";
import { NoteDocument } from "api-calls/notes/_notes.type";

export interface SortableNoteItemProps {
  id: string;
  note: NoteDocument;
}

export function SortableNoteItem(props: SortableNoteItemProps) {
  const { id, note } = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      variant={"outlined"}
      key={id}
      sx={{
        mt: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        position: "relative",
      }}
      style={style}
    >
      <Box
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        sx={(theme) => ({
          pl: 1,
          pr: 0.5,
          display: "flex",
          alignSelf: "stretch",
          alignItems: "center",
          cursor: isDragging ? "grabbing" : "grab",
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        })}
      >
        <DragOrderIcon />
      </Box>
      <NoteItemContent
        id={id}
        note={note}
        sx={{ pl: 0.5, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
      />
    </Card>
  );
}
