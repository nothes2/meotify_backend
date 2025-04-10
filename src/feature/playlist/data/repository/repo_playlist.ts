import { getDB } from "@core/config/database";
import { Library, PlayList } from "@features/playlist/domain/entities/en_playlist";
import { Album } from "@features/user/domain/entities/album";
import { Collection, ObjectId } from "mongodb";

export class PlaylistRepo {

    private collection: Collection;

    constructor() {
        this.collection = getDB().collection("playlist")
    }
    async getListByUserId(_id: string): Promise<Library[]> {
        return await this.collection.find(
            {
                $or: [{ "playlist.user_id": new ObjectId(_id) }, {
                    "playlist.user_id.$oid": _id
                }]
            }
        ).toArray();
    }

    async addAlbum(playlist: PlayList, _id: ObjectId): Promise<boolean> {
        return (await this.collection.insertOne({
            _id: new ObjectId(_id),
            playlist
        })).acknowledged
    }
}