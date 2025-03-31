import { User } from "@features/user/domain/entities/en_user";
import {AuthRepository} from "@features/user/data/repository/auth_repository"
import { db } from "@core/config/database";
import {password} from "bun";
export class AuthRepositoryImpl implements AuthRepository{
  private collection = db.collection("user")

  async usernameCheck(username: string): Promise<boolean> {
    const result = await this.collection.findOne({ "user.username": username });
    return !result
  }

  async emailCheck(email: string): Promise<boolean> {
    const result = await this.collection.findOne({ "user.email": email });
    return !result
  }

  async register(username: string, email: string, password: string): Promise<boolean> {

    const user: User = new User(username, email,await Bun.password.hash(password, { algorithm: "bcrypt",
      cost: 4,}) ,new Date(), new Date());
     const result = await this.collection.insertOne(
         {user}
     )

    return !!result
  }
  
  async login(email: string, plain_password: string): Promise<User | null> {
    const result = await this.collection.findOne({ "user.email": email  });
      if (!result) return null;
      const user = result.user;

      try {
        const isMatch = await password.verify(plain_password, user.password);
        console.log("faf")
        return isMatch ?  new User(
            user.username,
            user.email,
            user.password,
            user.created_at,
            user.update_at,
            user.pfp,
            user.bio,
            user._id,
        ) : null;
      } catch (error) {
        console.log(error);
      }
      return null
  }
}
