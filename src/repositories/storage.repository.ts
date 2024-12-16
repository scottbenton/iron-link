import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

import { storage } from "config/firebase.config";

import { FileFailedToUploadError, UnknownError } from "./errors/storageErrors";

export class StorageRepository {
  public static async storeImage(path: string, image: File): Promise<void> {
    return new Promise<void>((res, reject) => {
      const imageRef = ref(storage, `${path}/${image.name}`);

      uploadBytes(imageRef, image)
        .then(() => {
          res();
        })
        .catch((e) => {
          console.error(e);
          if (e instanceof Error) {
            reject(
              new FileFailedToUploadError(
                `Failed to upload ${image.name}.`,
                e.message,
              ),
            );
          } else {
            reject(
              new FileFailedToUploadError(`Failed to upload ${image.name}.`),
            );
          }
        });
    });
  }

  public static async deleteImage(
    path: string,
    filename: string,
  ): Promise<void> {
    const imageRef = ref(storage, `${path}/${filename}`);
    try {
      await deleteObject(imageRef);
    } catch (e) {
      console.error(e);
      throw new UnknownError(`Failed to delete ${filename}.`);
    }
  }

  public static async getImageUrl(
    path: string,
    filename: string,
  ): Promise<string> {
    const imageRef = ref(storage, `${path}/${filename}`);
    try {
      return await getDownloadURL(imageRef);
    } catch (e) {
      console.error(e);
      throw new UnknownError(`Failed to get download URL for ${path}.`);
    }
  }
}

export const MAX_FILE_SIZE = 2 * 1024 * 1024;
export const MAX_FILE_SIZE_LABEL = "2 MB";
