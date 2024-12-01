import { StorageError } from "repositories/errors/storageErrors";
import { UserDTO, UserRepository } from "repositories/user.repository";

export interface IUser {
  displayName: string;
  photoURL?: string;
  hidePhoto?: boolean;
  appVersion?: string;
}

export class UserService {
  public static listenToUser(
    userId: string,
    onUser: (user: IUser) => void,
    onError: (error: StorageError) => void,
  ): () => void {
    return UserRepository.listenToUser(
      userId,
      (userDTO) => {
        onUser(this.convertUserDTOToUser(userDTO));
      },
      onError,
    );
  }

  public static async getUser(userId: string): Promise<IUser> {
    const userDTO = await UserRepository.getUser(userId);
    return this.convertUserDTOToUser(userDTO);
  }

  public static async setUserNameAndPhoto(
    userId: string,
    displayName: string,
    photoURL?: string,
  ): Promise<void> {
    const partialUserDTO: Partial<UserDTO> = {
      displayName,
    };
    if (photoURL) {
      partialUserDTO.photoURL = photoURL;
    }
    await UserRepository.setUserDoc(userId, partialUserDTO);
  }

  private static convertUserDTOToUser(userDTO: UserDTO): IUser {
    return {
      displayName: userDTO.displayName,
      photoURL: userDTO.photoURL,
      hidePhoto: userDTO.hidePhoto,
      appVersion: userDTO.appVersion,
    };
  }
}
