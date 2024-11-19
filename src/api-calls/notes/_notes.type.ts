import { Bytes } from "firebase/firestore";

export enum ReadPermissions {
  OnlyAuthor = "only_author",
  OnlyGuides = "only_guides",
  AllPlayers = "all_players",
  GuidesAndAuthor = "guides_and_author",
  Public = "public",
}
export enum EditPermissions {
  OnlyAuthor = "only_author",
  OnlyGuides = "only_guides",
  GuidesAndAuthor = "guides_and_author",
  AllPlayers = "all_players",
}

export interface NoteDocument {
  title: string;
  order: number;

  creator: string;

  parentFolderId: string;

  // Permission sets can be null - we query folders first.
  readPermissions: ReadPermissions | null;
  editPermissions: EditPermissions | null;
}

export interface NoteContentDocument {
  notes?: Bytes; // Can be converted out to JSON or HTML - see DatabaseStructure.md
}

export interface NoteFolder {
  name: string;
  order: number;
  // Null if this is a root folder
  parentFolderId: string | null;
  creator: string;

  // Permission sets cannot be null - if we update a parent, we need to manually update children
  readPermissions: ReadPermissions;
  editPermissions: EditPermissions;
}
