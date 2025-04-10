import { connectDB, getDB } from "@core/config/database";
import {FileUploadRepo} from "@features/fileload/data/repository/repo_file_upload";
import { Track } from "@features/fileload/domain/entities/Track";
import { Collection } from "mongodb";

export class FileUploadImpl implements FileUploadRepo {
    
     private collection: Collection;

    //  TODO upload the song infomation here
    
     constructor() {
        this.collection = getDB().collection("song")
     }

      async uploadMusic(track: Track): Promise<boolean> {
        const result = await this.collection.insertOne({
            track
        })

        if (!result.acknowledged) {
            return false
        }
        return true
    }

    updateProfilePicture(_id: string, picture: string): Promise<boolean> {
        return Promise.resolve(false);
    }

   

}