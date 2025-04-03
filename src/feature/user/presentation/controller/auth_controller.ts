import { Elysia } from "elysia";
import { LoginUseCase, UsernameCheckUseCase, EmailCheckUseCase } from "@features/user/domain/usecases/auth_usecase";
import { RegisterUseCase } from "@features/user/domain/usecases/auth_usecase";
import { AuthRepositoryImpl } from "@features/user/data/repository/auth_repository_impl";
import { jwtService } from "@core/security/jwt";
import {jwtDecode} from "jwt-decode";

const authRepo = new AuthRepositoryImpl();

interface LoginRequest {
  email: string;
  password: string;
}

interface TokenLoginRequest {
  token: string;
}


interface RegisterCheckRequest {
  username?: string;
  email?: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

interface ResponseBody {
  success: boolean;
  message: string;
  data?: any;
}

interface TokenData {
  id: string;
  email: string;
  password: string;
  exp: number;
}

const loginUseCase = new LoginUseCase(authRepo);
const register = new RegisterUseCase(authRepo);
const emailCheck = new EmailCheckUseCase(authRepo);
const usernameCheck = new UsernameCheckUseCase(authRepo);

export const authController = new Elysia().use(jwtService)
  .post("/login", async ({ body, jwt }) => {

    const { email, password } = body as LoginRequest;

    console.log(email)
    const user = await loginUseCase.execute(email, password);
    console.log("user:",user)
    if (!user) {
      return { success: false, message: "Invalid credentials" } as ResponseBody;
    }

    const token = await jwt.sign({ id: user._id?.toString() ?? "", email: user.email, password: user.password });
    return { success: true, message: "success" ,data: {token} } as ResponseBody

  }).post("/login_by_token", async ({body, jwt}) => {
    const {token} = body as TokenLoginRequest;
    const result = await jwt.verify(token)

      if (!result) {
        return { success: false, message: "Invalid credentials" } as ResponseBody;
      }

      const token_data = jwtDecode(token) as TokenData;
      const {id} = token_data;

      const user = await loginUseCase.loginByToken(id);
      if(!user)
        return { success: false, message: "can not find user" } as ResponseBody;
      return { success: true, message: "success", data: {user} } as ResponseBody;
    })

    .post("/register", async ({ body }) => {
    const { username, email, password } = body as RegisterRequest;
    const flag = await register.execute(username, email, password)

    return {success: flag}
  }).post("/email_check", async ({body}) => {
    const {email} = body as RegisterCheckRequest;

    if(!email) {
      return {success: false, message: "body param missed!"} as ResponseBody
    }

    const flag = await emailCheck.execute(email);
    return {success: flag};
  }).post("/username_check", async ({body}) => {
    const {username} = body as RegisterCheckRequest;
    
    if(!username) {
      return {success: false, message: "body param missed!"} as ResponseBody
    }

    const flag = await usernameCheck.execute(username);
    return {success: flag, message: "success"} as ResponseBody;
  });
