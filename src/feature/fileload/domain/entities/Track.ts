import { ObjectId } from "mongodb";

export class Track {
   duration: number;
   url: string;
   createdAt: Date;
   updatedAt: Date;
   uploader_id: ObjectId;
   title?: string;
   artist?: string;
   albumId?: ObjectId;
   coverUrl?: string;
   genre?: string;
   _id?: ObjectId;

   constructor(
      duration: number,
      url: string,
      createdAt: Date,
      updatedAt: Date,
      uploader_id: ObjectId,
      title?: string,
      artist?: string,
      albumId?: ObjectId,
      coverUrl?: string,
      genre?: string,
      _id?: ObjectId
   ) {
      this.duration = duration;
      this.url = url;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
      this.uploader_id = uploader_id;
      this.title = title;
      this.artist = artist;
      this.albumId = albumId;
      this.coverUrl = coverUrl;
      this.genre = genre;
      this._id = _id;
   }

   updateDetails(
      title?: string,
      artist?: string,
      albumId?: ObjectId,
      coverUrl?: string,
      genre?: string
   ): void {
      if (title) this.title = title;
      if (artist) this.artist = artist;
      if (albumId) this.albumId = albumId;
      if (coverUrl) this.coverUrl = coverUrl;
      if (genre) this.genre = genre;
      this.updatedAt = new Date();
   }

   toJSON(): Record<string, unknown> {
      return {
         _id: this._id,
         duration: this.duration,
         url: this.url,
         createdAt: this.createdAt,
         updatedAt: this.updatedAt,
         uploader_id: this.uploader_id,
         title: this.title,
         artist: this.artist,
         albumId: this.albumId,
         coverUrl: this.coverUrl,
         genre: this.genre,
      };
   }
}