import { ObjectId } from "mongodb"
export class User {
  username: string;
  email: string;
  password: string;
  created_at: Date;
  update_at: Date;
  pfp?: string;
  bio?: string;
  _id?: ObjectId;


  constructor(username: string,
    email: string,
    password: string,
    created_at: Date,
    update_at: Date,
    pfp?: string,
    bio?: string,
    _id?: ObjectId,

  ) {
    this.email = email;
    this.password = password;
    this.created_at = created_at;
    this.update_at = update_at;
    this.pfp = pfp;
    this.bio = bio;
    this._id = _id;
    this.username = username;
  }
}