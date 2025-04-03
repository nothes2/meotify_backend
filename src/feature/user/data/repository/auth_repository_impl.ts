import { User } from "@features/user/domain/entities/en_user";
import {AuthRepository} from "@features/user/data/repository/auth_repository"
import {connectDB, db} from "@core/config/database";
import {password} from "bun";
import * as Bun from "bun";
import {ObjectId} from "mongodb";
import {PlayList} from "@features/user/domain/entities/en_playlist";
export class AuthRepositoryImpl implements AuthRepository{
  private client = connectDB();
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

    const session = (await this.client).startSession()

    try{
      let result
      session.startTransaction()
      const user: User = new User(username, email,await Bun.password.hash(password, { algorithm: "bcrypt",
        cost: 4,}) ,new Date(), new Date());
      result = await this.collection.insertOne(
          {user}, {session}
      )

      const id = result.insertedId

      if (!id) {
        await session.abortTransaction();
        return false;
      }

     const collection = db.collection("playlist")
      const playlist = new PlayList(
          "Loved Playlist",
          "ic_loved.svg",
          false,
          "playlist",
          new Date(),
          new Date(),
          id,
          [],
          [],
      )
      result = collection.insertOne({playlist}, {session})

      if (!result) {
        await session.abortTransaction();
        return false;
      }

      await session.commitTransaction()
      return !!result
    } catch (e) {
      await session.abortTransaction()
      console.error(e)
      return false

    } finally {
      await session.endSession()
    }
  }
  
  async login(email: string, plain_password: string): Promise<User | null> {
    const result = await this.collection.findOne({ "user.email": email  });
      if (!result) return null;
      const user = result.user;

      try {
        const isMatch = await password.verify(plain_password, user.password);
        return isMatch ?  new User(
            user.username,
            user.email,
            user.password,
            user.created_at,
            user.update_at,
            user.pfp,
            user.bio,
            result._id,
        ) : null;
      } catch (error) {
        console.log(error);
      }
      return null
  }

  async loginByToken(id: string): Promise<User | null> {
   const result = await this.collection.findOne({_id: new ObjectId(id)});

   if(!result) return null;
    return new User(result.user.username, result.user.email, result.user.password, result.user.created_at, result.user.update_at, result.user.pfp, result.user.bio, result._id);
  }
}
