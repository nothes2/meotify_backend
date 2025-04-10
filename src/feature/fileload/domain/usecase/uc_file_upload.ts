import {FileUploadRepo} from "@features/fileload/data/repository/repo_file_upload";
import { Track } from "../entities/Track";

export class FileUploadUseCase {
    constructor(private fileUpload: FileUploadRepo) {
    }

    async execute(track: Track):Promise<boolean> {
        return await this.fileUpload.uploadMusic(track);
    }
}