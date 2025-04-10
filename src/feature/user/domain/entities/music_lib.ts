import {ObjectId} from "mongodb";

class MusicLib {
    constructor(
        title: string,

        is_private: boolean,
        created_at: Date,
        updated_at: Date,
        creator_id: ObjectId,
        description?: string,
        cover?: string,
        songs?: [],
        id?: ObjectId,
    ) {
    }

}