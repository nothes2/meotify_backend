import {ObjectId} from "mongodb",

export class Track {
 constructor(
    title: string,
    artist: string,
    album?: string,
    duration: number,
    url: string,
    coverUrl?: string,
    uploadedBy: string,
    metadata?: Record<string, string>,
    createdAt: Date,
    _id: ObjectId
 ) {}
}