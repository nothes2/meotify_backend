import { Track } from "@features/fileload/domain/entities/Track";
import { ObjectId } from "mongodb";

export interface FileUploadRepo {
    publishMusic(_id: ObjectId, publish_path: string, publish_cover: string, title: string, genre: string, uploader_id: string): Promise<boolean>;
    updateProfilePicture(_id: string, picture: string): Promise<boolean>;
    uploadMusic(track: Track): Promise<boolean>;
}