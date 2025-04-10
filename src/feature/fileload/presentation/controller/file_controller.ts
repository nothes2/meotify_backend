import {Elysia, t} from 'elysia';
import { writeFile } from 'fs/promises';
import {FileUploadUseCase} from "@features/fileload/domain/usecase/uc_file_upload";
import {FileUploadImpl} from "@features/fileload/data/repository/file_upload_impl";
import ffmpeg from "fluent-ffmpeg";
import { existsSync, mkdirSync } from 'fs';
import { Track } from '@features/fileload/domain/entities/Track';
import { ObjectId } from 'mongodb';
import { File } from 'buffer';
import path from 'path';

interface FileData {
    file:File,
    _id: string
}

const ffprobePromise = (path: string): Promise<any> =>
  new Promise((resolve, reject) => {
    ffmpeg.ffprobe(path, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

const convertToMp3 =  (inputPath: string) => {
    const mp3Path = inputPath.replace(/\.[^/.]+$/, ".mp3");
     ffmpeg(inputPath)
      .toFormat('mp3')
      .audioBitrate(192)
      .save(mp3Path)
      .on('end', () => {
        console.log('Conversion completed');
        return mp3Path
      })
      .on('error', (err) => {
        console.error('Error:', err);
        return ""
       
        
      });

      return mp3Path
  };

  const extractAlbumArt = (inputPath: string, outputPath: string) => {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .output(outputPath)
        .outputOptions('-map', '0:v:0') // Extract first video stream (album art)
        .on('end', () => {
          console.log('Album art extracted successfully!');
          resolve(outputPath);
        })
        .on('error', (err) => {
          console.error('Error extracting album art:', err);
          reject(err);
        })
        .run();
    });
  };

export const  fileController = new Elysia().post('/upload', async ({ body } ) =>  {

  try {
    console.log("entering upload");
    const { file, _id } = body as FileData;
    const fileUploadRepo = new FileUploadUseCase(new FileUploadImpl());

    if (!file || !(file instanceof File)) {
      return { success: false, message: 'Invalid file uploaded.' };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    const uploadDir = `${process.cwd()}\\uploads\\music\\${_id}`;

    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    let uploadPath = `${uploadDir}\\${filename}`;
    await writeFile(uploadPath, buffer);

    if (!(file.name.split('.').pop()?.toLowerCase() === 'mp3')) {
      uploadPath = await convertToMp3(uploadPath);
    }

    const metadata = await ffprobePromise(uploadPath);
    console.log('Metadata:', metadata);

    const albumArtPath = `${process.cwd()}\\uploads\\temp\\${_id}${filename}.png`;
    try {
      await extractAlbumArt(uploadPath, albumArtPath);
    } catch (error) {
      console.error("Album art extraction error:", error);
    }

    const track = new Track(
      metadata.format.duration ?? 0,
      uploadPath,
      new Date(),
      new Date(),
      new ObjectId(_id),
      file.name,
      String(metadata.format.tags?.artist ?? ""),
      undefined,
      albumArtPath,
      String(metadata.format.tags?.genre ?? "")
    );
    
    

    const flag = await fileUploadRepo.execute(track);

    if (!flag) {
      return { success: false, message: "Database resolve failed!", data: [] };
    }
    console.log(track);
    return { success: true, message: "Success!", data: [track] };

  } catch (error) {
    console.error('File upload error:', error);
    return { success: false, message: 'An error occurred during file upload.' };
  }
}).post("/update_music", async  ({body}) => {
  const track = body as Track

}).post("/upload_album_cover", async ({body}) => {
  const { file } = body as { file: File };
  const filename = `${crypto.randomUUID()}-${file.name}`;

  const filePath = path.join(process.cwd(), `\\uploads\\temp`, filename)
  const buffer = Buffer.from(await file.arrayBuffer());
  
  try {
    await writeFile(filePath, buffer);
  } catch (error) {
    console.log(error);
    return {success: false, message: "writeFileFailed", body:[]}
  }

  return {success: true, message: "success", data: {tempId: filename}}
})
