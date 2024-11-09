import { firestore } from "config/firebase.config";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
} from "firebase/firestore";

import { NoteContentDocument, NoteDocument, NoteFolder } from "./_notes.type";

// Collection Paths

export function constructNoteFolderCollectionPath(campaignId: string) {
  return `/campaigns/${campaignId}/noteFolders`;
}
export function constructNoteCollectionPath(campaignId: string) {
  return `/campaigns/${campaignId}/notes`;
}

// Document Paths

export function constructNoteDocPath(campaignId: string, noteId: string) {
  return `/campaigns/${campaignId}/notes/${noteId}`;
}
export function constructNoteFolderPath(campaignId: string, folderId: string) {
  return `/campaigns/${campaignId}/noteFolders/${folderId}`;
}

export function constructNoteContentPath(campaignId: string, noteId: string) {
  return `/campaigns/${campaignId}/notes/${noteId}/content/content`;
}

// Collection References

export function getNoteFolderCollection(campaignId: string) {
  return collection(
    firestore,
    constructNoteFolderCollectionPath(campaignId),
  ) as CollectionReference<NoteFolder>;
}

export function getNoteCollection(campaignId: string) {
  return collection(
    firestore,
    constructNoteCollectionPath(campaignId),
  ) as CollectionReference<NoteDocument>;
}

// Document References

export function getNoteFolderDocument(campaignId: string, folderId: string) {
  return doc(
    firestore,
    constructNoteFolderPath(campaignId, folderId),
  ) as DocumentReference<NoteFolder>;
}

export function getNoteDocument(campaignId: string, noteId: string) {
  return doc(
    firestore,
    constructNoteDocPath(campaignId, noteId),
  ) as DocumentReference<NoteDocument>;
}

export function getNoteContentDocument(campaignId: string, noteId: string) {
  return doc(
    firestore,
    constructNoteContentPath(campaignId, noteId),
  ) as DocumentReference<NoteContentDocument>;
}

// So what does it look like to fetch all this information?

// Query all folders where I have permission
// THEN
// Query all notes where I have permission OR notes in folders where I have permission

export const GUIDE_NOTE_FOLDER_NAME = "guide-notes";
