export interface Note {
  noteId: string;

  title: string;
  order: number;
  shared: boolean;
}

export enum NoteSource {
  Character = "character",
  Campaign = "campaign",
}
