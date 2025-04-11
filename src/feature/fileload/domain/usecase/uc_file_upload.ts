import {FileUploadRepo} from "@features/fileload/data/repository/repo_file_upload";
import { Track } from "../entities/Track";
import { ObjectId } from "mongodb";

export class FileUploadUseCase {
    constructor(private fileUpload: FileUploadRepo) {
    }

    async execute(track: Track):Promise<boolean> {
        return await this.fileUpload.uploadMusic(track);
    }
}

export class MusicPublishUseCase {
    constructor(private fileUpload: FileUploadRepo) {
    }

    async execute(_id: ObjectId, publish_path: string, publish_cover: string, title: string, genre: string, uploader_id: string):Promise<boolean> {
        return await this.fileUpload.publishMusic(_id, publish_path, publish_cover, title, genre, uploader_id);
    }
}