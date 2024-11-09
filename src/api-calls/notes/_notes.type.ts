import { Bytes } from "firebase/firestore";

export enum ViewPermissions {
  OnlyGuides = "only_guides",
  AllPlayers = "all_players",
  GuidesAndPlayerSubset = "guides_and_player_subset",
  OnlyAuthor = "only_author",
  Public = "public",
}
export enum WritePermissions {
  OnlyGuides = "only_guides",
  AllPlayers = "all_players",
  GuidesAndPlayerSubset = "guides_and_player_subset",
  OnlyAuthor = "only_author",
}

export interface NoteDocument {
  title: string;
  order: number;

  creator: string;

  parentFolderId: string;
  // If permission set is null, inherit from the parent folder
  viewPermissions: {
    type: ViewPermissions;
    players?: string[];
    inherited: boolean;
  } | null;
  writePermissions: {
    type: WritePermissions;
    players?: string[];
    inherited: boolean;
  } | null;
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
  viewPermissions: {
    type: ViewPermissions;
    players?: string[];
    inherited: boolean;
  };
  writePermissions: {
    type: WritePermissions;
    players?: string[];
    inherited: boolean;
  };
}
