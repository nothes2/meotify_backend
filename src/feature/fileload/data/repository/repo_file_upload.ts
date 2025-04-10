import { Track } from "@features/fileload/domain/entities/Track";

export interface FileUploadRepo {
    updateProfilePicture(_id: string, picture: string): Promise<boolean>;
    uploadMusic(track: Track): Promise<boolean>;
}