import { User } from "@features/user/domain/entities/en_user";

export interface AuthRepository {
  login(email: string, password: string): Promise<User | null>;
  register(username: string, email: string, password: string): Promise<boolean>;
  usernameCheck(username: string): Promise<boolean>;
  emailCheck( email: string): Promise<boolean>;
  loginByToken(id: string): Promise<User | null>;
}