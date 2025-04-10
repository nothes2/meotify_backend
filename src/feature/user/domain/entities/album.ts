export class Album {
    name: string;
    image: string;
    canBeRemoved: boolean;
    type: string;
    createdAt: Date;
    updatedAt: Date;
    user_id: string;
    songs: any[];
    subfolders: any[];
    description?: string;
    id?: string;

    constructor(
        name: string,
        image: string,
        canBeRemoved: boolean,
        type: string,
        createdAt: Date,
        updatedAt: Date,
        user_id: string,
        songs: any[],
        subfolders: any[],
        description?: string,
        id?: string
    ) {
        this.name = name;
        this.image = image;
        this.canBeRemoved = canBeRemoved;
        this.type = type;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.user_id = user_id;
        this.songs = songs;
        this.subfolders = subfolders;
        this.description = description;
        this.id = id;
    }
}