import {ObjectId} from "mongodb";

export class JamSession {
    constructor(
        name: string,
        creator_id: ObjectId,
        participate_id: [],
        start_at: Date,
        isLive: boolean,
        currentSongId?: ObjectId,
        id?: ObjectId
    ) {
    }

}