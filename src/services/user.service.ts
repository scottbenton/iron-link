import { UserDTO, UserRepository } from "repositories/user.repository";

export interface IUser {
  id: string;
  displayName: string | null;
}

export class UserService {
  public static async getUser(userId: string): Promise<IUser> {
    const userDTO = await UserRepository.getUser(userId);
    return this.convertUserDTOToUser(userDTO);
  }

  public static async setUserName(
    userId: string,
    displayName: string,
  ): Promise<void> {
    await UserRepository.updateUser(userId, { display_name: displayName });
  }

  private static convertUserDTOToUser(userDTO: UserDTO): IUser {
    return {
      id: userDTO.id,
      displayName: userDTO.display_name,
    };
  }
}
