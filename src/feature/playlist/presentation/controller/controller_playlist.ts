import { Track } from "@features/fileload/domain/entities/Track";
import { PlaylistRepo } from "@features/playlist/data/repository/repo_playlist";
import { Library, PlayList } from "@features/playlist/domain/entities/en_playlist";
import { Album } from "@features/user/domain/entities/album";
import Elysia from "elysia";
import fs from "fs"
import { ObjectId } from "mongodb";

interface UserId {
    _id: string
}

export const playlistController = new Elysia().post("/playlist", async ({body}) => {
    const playlistRepo = new PlaylistRepo();
    
    const {_id} = body as UserId;

    const lib: Array<Library> = await playlistRepo.getListByUserId(_id);
    console.info(lib)
    if(lib.length === 0) {
        console.info(lib)
        return { success: false, message: "playlist cannot found", data: []}
    }

    return {success: true, message: "success!", data: [lib]}
})
.post("/add_album", async ({body}) => {
  
    try {
  
    const playlist = (body as { playlist: PlayList })['playlist'];
    const imageFilename = playlist.image;

    
    
    const albumId = new ObjectId();
    const id = playlist.user_id.$oid

    const finalPath = `${process.cwd()}/uploads/albums/${id}/${albumId}.${imageFilename?.split('.').pop()}`;
  
    if(!fs.existsSync(`${process.cwd()}/uploads/albums/${id}`)) {
        fs.mkdirSync(`${process.cwd()}/uploads/albums/${id}`)
    } 
    const tempPath = `${process.cwd()}/uploads/temp/${imageFilename}`;
    if(fs.existsSync(tempPath) ) {
        fs.renameSync(tempPath, finalPath)
         playlist.image = `/albums/${id}/${albumId}.${imageFilename?.split('.').pop()}`
    } else {
        playlist.image = undefined
    }
        
     console.log("file not exists, skip the image cover upload.");

    const new_playlist = new PlayList(
        playlist.name,
        playlist.can_be_removed,
        playlist.type,
        new Date(playlist.created_at),
        new Date(),
        id,
        playlist.image,
        playlist.songs,
        playlist.subfolders,
        playlist.description,
    );


    const flag = new PlaylistRepo().addAlbum(playlist, albumId)

    if(!flag) return {success: false, message: "insert to database failed!", data: []}
    return {success: true, message: "success!", data: []}
   } catch (e) {
    console.log(e);
    
   }
})