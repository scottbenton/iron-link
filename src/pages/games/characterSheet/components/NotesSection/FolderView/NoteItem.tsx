import DocIcon from "@mui/icons-material/Description";
import {
  Box,
  Card,
  CardActionArea,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";

import { useSetOpenItem } from "pages/games/gamePageLayout/atoms/notes.atom";

import { NoteDocument } from "api-calls/notes/_notes.type";

import { NoteActionMenu } from "./NoteActionMenu";

export interface NoteItemProps {
  id: string;
  note: NoteDocument;
}

export function NoteItem(props: NoteItemProps) {
  const { id, note } = props;

  return (
    <Card variant={"outlined"} key={id} sx={{ mt: 1, position: "relative" }}>
      <NoteItemContent id={id} note={note} />
    </Card>
  );
}

export function NoteItemContent(
  props: NoteItemProps & { sx?: SxProps<Theme> },
) {
  const { id, note, sx } = props;

  const setOpenItem = useSetOpenItem();

  return (
    <>
      <CardActionArea
        sx={[
          {
            py: 1.5,
            px: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 1,
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        onClick={() => setOpenItem({ type: "note", noteId: id })}
      >
        <DocIcon sx={{ color: "primary.light" }} />
        <Typography sx={{ flexGrow: 1 }}>{note.title}</Typography>
        <Box
          sx={(theme) => ({
            width: `calc(${theme.spacing(1 - 2)} + 40px)`,
            justifySelf: "flex-end",
            ml: 1,
          })}
        />
      </CardActionArea>
      <NoteActionMenu noteId={id} />
    </>
  );
}
