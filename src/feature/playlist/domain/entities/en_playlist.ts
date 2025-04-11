import { ObjectId } from "mongodb"

export class Library {
    constructor(
        list?: PlayList,
        _id?: string
    ){

    }
}

export class PlayList {
    name: string;
    can_be_removed: boolean;
    type: string;
    created_at: Date;
    updated_at: Date;
    user_id: ObjectId
    image?: string;
    songs?: Array<any>;
    subfolders?: Array<any>;
    description?: string;
    _id?: ObjectId;

    constructor(
        name: string,
        
        can_be_removed: boolean,
        type: string,
        created_at: Date,
        updated_at: Date,
        user_id: ObjectId,
        image?: string,
        songs?: Array<any>,
        subfolders?: Array<any>,
        description?: string,
        _id?: ObjectId
    ) {
        this.name = name;
        this.image = image;
        this.description = description;
        this.type = type;
        this.can_be_removed = can_be_removed;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.user_id = user_id;
        this.songs = songs;
        this.subfolders = subfolders;
        this._id = _id;
    }
}