import { AuthRepository } from "../../data/repository/auth_repository";
import { User } from "../entities/en_user";

export class LoginUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(email: string, password: string): Promise<User | null> {

    return await this.authRepository.login(email, password);
  }

  async loginByToken(id: string) {
    return await this.authRepository.loginByToken(id);
  }
}


export class RegisterUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(username: string, email: string, password: string): Promise<boolean> {
    return await this.authRepository.register(username, email, password);
  }
}


export class EmailCheckUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(email: string): Promise<boolean> {
    return await this.authRepository.emailCheck(email);
  }
}

export class UsernameCheckUseCase {
  constructor(private authRepository: AuthRepository) {}
  async execute(username: string): Promise<boolean> {
    return await this.authRepository.usernameCheck(username);
  }
}