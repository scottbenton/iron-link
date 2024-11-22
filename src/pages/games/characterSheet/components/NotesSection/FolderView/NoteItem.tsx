import DocIcon from "@mui/icons-material/Description";
import { Card, CardActionArea, Typography } from "@mui/material";

import { NoteDocument } from "api-calls/notes/_notes.type";
import { useSetOpenItem } from "pages/games/gamePageLayout/atoms/notes.atom";

export interface NoteItemProps {
  id: string;
  note: NoteDocument;
}

export function NoteItem(props: NoteItemProps) {
  const { id, note } = props;

  return (
    <Card variant={"outlined"} key={id} sx={{ mt: 1 }}>
      <NoteItemContent id={id} note={note} />
    </Card>
  );
}

export function NoteItemContent(props: NoteItemProps) {
  const { id, note } = props;

  const setOpenItem = useSetOpenItem();

  return (
    <CardActionArea
      sx={{
        py: 1.5,
        px: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 1,
      }}
      onClick={() => setOpenItem({ type: "note", noteId: id })}
    >
      <DocIcon sx={{ color: "primary.light" }} />
      <Typography>
        {note.order}:{note.title}
      </Typography>
    </CardActionArea>
  );
}
