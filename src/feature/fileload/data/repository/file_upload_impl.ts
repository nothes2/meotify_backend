import { connectDB, getDB } from "@core/config/database";
import { FileUploadRepo } from "@features/fileload/data/repository/repo_file_upload";
import { Track } from "@features/fileload/domain/entities/Track";
import { Collection, ObjectId } from "mongodb";

export class FileUploadImpl implements FileUploadRepo {

    private collection: Collection;

    //  TODO upload the song infomation here

    constructor() {
        this.collection = getDB().collection("song")
    }
    async publishMusic(_id: ObjectId, publish_path: string, publish_cover: string, title: string, genre: string, uploader_id: string): Promise<boolean> {
        console.log(_id)
        try {

            const result = await this.collection.findOneAndUpdate({ "track._id": _id }, {
                $set: {
                    "track.url": publish_path,
                    "track.coverUrl": publish_cover,
                    "track.title": title,
                    "track.genre": genre,
                    "track.uploader_id": uploader_id
                }, $currentDate: {
                    "track.updatedAt": true
                }
            })
            return !!result
        } catch (error) {
            console.log(error);

        }

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