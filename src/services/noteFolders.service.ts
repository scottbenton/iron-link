import { GamePermission } from "stores/game.store";

import { StorageError } from "repositories/errors/storageErrors";
import {
  NoteFolderDTO,
  NoteFoldersRepository,
} from "repositories/noteFolders.repository";
import { EditPermissions, ReadPermissions } from "repositories/shared.types";

export type INoteFolder = NoteFolderDTO;

export class NoteFoldersService {
  public static listenToGameNoteFolders(
    uid: string | undefined,
    gameId: string,
    permissions: GamePermission,
    onNoteFolderChanges: (
      changedNoteFolders: Record<string, INoteFolder>,
      removedNoteFolderIds: string[],
    ) => void,
    onError: (error: StorageError) => void,
  ): () => void {
    return NoteFoldersRepository.listenToNoteFolders(
      uid,
      gameId,
      permissions,
      onNoteFolderChanges,
      onError,
    );
  }

  public static addFolder(
    uid: string,
    gameId: string,
    parentFolderId: string | null,
    order: number,
    name: string,
    readPermissions: ReadPermissions,
    editPermissions: EditPermissions,
    folderId?: string,
  ): Promise<string> {
    return NoteFoldersRepository.addNoteFolder(
      gameId,
      {
        name,
        order,
        parentFolderId,
        creator: uid,
        readPermissions,
        editPermissions,
      },
      folderId,
    );
  }
  public static updateFolderName(
    gameId: string,
    folderId: string,
    name: string,
  ): Promise<void> {
    return NoteFoldersRepository.updateNoteFolder(gameId, folderId, { name });
  }

  public static updateFolderPermissions(
    gameId: string,
    folderId: string,
    readPermissions: ReadPermissions,
    editPermissions: EditPermissions,
  ): Promise<void> {
    return NoteFoldersRepository.updateNoteFolder(gameId, folderId, {
      readPermissions,
      editPermissions,
    });
  }
  public static updateParentFolder(
    gameId: string,
    folderId: string,
    parentFolderId: string,
  ): Promise<void> {
    return NoteFoldersRepository.updateNoteFolder(gameId, folderId, {
      parentFolderId,
    });
  }

  public static deleteFolder(gameId: string, folderId: string): Promise<void> {
    return NoteFoldersRepository.deleteNoteFolder(gameId, folderId);
  }
}
