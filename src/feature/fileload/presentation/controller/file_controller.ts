import { Elysia, t } from 'elysia';
import { writeFile } from 'fs/promises';
import { FileUploadUseCase, MusicPublishUseCase } from "@features/fileload/domain/usecase/uc_file_upload";
import { FileUploadImpl } from "@features/fileload/data/repository/file_upload_impl";
import ffmpeg from "fluent-ffmpeg";
import { existsSync, mkdirSync } from 'fs';
import { Track } from '@features/fileload/domain/entities/Track';
import { ObjectId } from 'mongodb';
import { File } from 'buffer';
import path from 'path';
import fs from "fs";

interface FileData {
  file: File,
  _id: string
}

interface TrackData {
  album_cover: string,
  title: string,
  genre: string,
  url: string,
  id: ObjectId,
  uploader_id: string
}

const ffprobePromise = (path: string): Promise<any> =>
  new Promise((resolve, reject) => {
    ffmpeg.ffprobe(path, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

const convertToMp3 = async (inputPath: string) => {
  const mp3Path = inputPath.replace(/\.[^/.]+$/, ".mp3");
  return new Promise<string>((resolve, reject) => {
    ffmpeg(inputPath)
      .toFormat('mp3')
      .audioBitrate(192)
      .save(mp3Path)
      .on('end', async () => {
        console.log('Conversion completed');
        try {
          await fs.promises.unlink(inputPath);
          console.log('Original file deleted successfully');
        } catch (err) {
          console.error('Error deleting original file:', err);
        }
        resolve(mp3Path);
      })
      .on('error', (err) => {
        console.error('Error:', err);
        reject(err);
      });
  });
};

const extractAlbumArt = (inputPath: string, outputPath: string) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) {
        console.error('Error reading metadata:', err);
        return reject(err);
      }

      const hasAlbumArt = metadata.streams.some(
        (stream) => {
          console.log(stream.codec_type)
          return stream.codec_type === 'video'
        }
      );

      if (!hasAlbumArt) {
        return resolve(null);
      }

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
  });
};

export const fileController = new Elysia().post('/upload', async ({ body }) => {

  try {
    console.log("entering upload");
    const { file, _id } = body as FileData;
    const fileUploadRepo = new FileUploadUseCase(new FileUploadImpl());
    const tempId = new ObjectId();

    if (!file || !(file instanceof File)) {
      return { success: false, message: 'Invalid file uploaded.' };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    const uploadDir = `${process.cwd()}\\uploads\\temp\\${_id}`;

    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    let uploadPath = `${uploadDir}\\${filename}`;
    await writeFile(uploadPath, buffer);

    if (!(file.name.split('.').pop()?.toLowerCase() === 'mp3')) {
      uploadPath = await convertToMp3(uploadPath);
    }

    const metadata = await ffprobePromise(uploadPath);

    let tempPath = `${tempId.toString()}-${filename.replace(/\.[^/.]+$/, ".jpg")}`;

    const albumArtPath = `${process.cwd()}\\uploads\\temp\\${tempPath}`;
    try {

      const path = await extractAlbumArt(uploadPath, albumArtPath);
      console.log(path);

      if (!path) {
        tempPath = ""
      }
    } catch (error) {
      tempPath = "";
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
      String(metadata.format.tags?.genre ?? ""),
      new ObjectId()
    );


    const flag = await fileUploadRepo.execute(track);

    if (!flag) {
      return { success: false, message: "Database resolve failed!", data: [] };
    }

    console.info('success', track)
    return { success: true, message: "Success!", data: [track, tempPath === "" ? null : tempPath] };

  } catch (error) {
    console.error('File upload error:', error);
    return { success: false, message: 'An error occurred during file upload.' };
  }
}).post("/publish_music", async ({ body }) => {
  const trackData = body as TrackData
  const _id = trackData.id;
  const tempImagePath = `${process.cwd()}\\uploads\\${trackData.album_cover}`
  const mp3Path = trackData.url
  const fileName = path.basename(trackData.url);
  // TODO fix path
  
  const publish_path = `${process.cwd()}\\uploads\\music\\${trackData.uploader_id}\\${_id}\\${fileName}`
  const publish_cover = `${process.cwd()}\\uploads\\music\\${trackData.uploader_id}\\${_id}\\${trackData.album_cover.replace("temp/", "")}`

  const normalizedTempPath = path.normalize(tempImagePath);
  const normalizedDestPath = path.normalize(publish_cover);
  const normalizeMp3Path = path.normalize(mp3Path);
  const normalizePublishPath = path.normalize(publish_path);

  const dir = path.dirname(publish_path);

  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.renameSync(normalizedTempPath, normalizedDestPath)
    fs.renameSync(normalizeMp3Path, normalizePublishPath)

    console.log(trackData);

    const fileUploadRepo = new MusicPublishUseCase(new FileUploadImpl())
    const flag = fileUploadRepo.execute(_id, normalizePublishPath, normalizedDestPath, trackData.title, trackData.genre, trackData.uploader_id)

    console.log(`flag in 194:1: ${flag}`)
    return {success: flag, message: `${flag}`, data: []}

  } catch (e) {
    console.error(e);
  }


}).post("/upload_album_cover", async ({ body }) => {

  const { file } = body as { file: File };
  const filename = `${crypto.randomUUID()}-${file.name}`;

  const filePath = path.join(process.cwd(), `\\uploads\\temp`, filename)
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    await writeFile(filePath, buffer);
  } catch (error) {
    console.log(error);
    return { success: false, message: "writeFileFailed", body: [] }
  }
  return { success: true, message: "success", data: { tempId: filename } }
})
