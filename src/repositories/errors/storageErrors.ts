import { FirebaseError } from "firebase/app";

export enum StorageErrorCodes {
  NotFound = "NOT_FOUND",
  PermissionDenied = "PERMISSION_DENIED",
  Unknown = "UNKNOWN",
}

export class StorageError extends Error {
  code: StorageErrorCodes;
  originalMessage?: string;

  constructor(
    message: string,
    code: StorageErrorCodes,
    originalMessage?: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.originalMessage = originalMessage;
  }
}

export class NotFoundError extends StorageError {
  constructor(message: string, originalMessage?: string) {
    super(message, StorageErrorCodes.NotFound, originalMessage);
  }
}

export class PermissionDeniedError extends StorageError {
  constructor(message: string, originalMessage?: string) {
    super(message, StorageErrorCodes.PermissionDenied, originalMessage);
  }
}

export class UnknownError extends StorageError {
  constructor(message: string, originalMessage?: string) {
    super(message, StorageErrorCodes.Unknown, originalMessage);
  }
}

export function convertFirebaseErrorToStorageError(
  firebaseError: FirebaseError,
  message: string,
): StorageError {
  switch (firebaseError.code) {
    case "not-found":
      return new NotFoundError(message, firebaseError.message);
    case "permission-denied":
      return new PermissionDeniedError(message, firebaseError.message);
    default:
      return new UnknownError(message, firebaseError.message);
  }
}

export function convertUnknownErrorToStorageError(
  error: unknown,
  message: string,
): StorageError {
  if (error instanceof FirebaseError) {
    return convertFirebaseErrorToStorageError(error, message);
  } else if (error instanceof Error) {
    return new UnknownError(message, error.message);
  } else {
    return new UnknownError(message);
  }
}
