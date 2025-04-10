import path from 'path';
import { Elysia, t } from 'elysia';
import { stat } from 'node:fs/promises';
import fs from 'fs';
import { Readable } from "stream";

export const staticController = new Elysia().get('/temp/:filename', async ({params: {filename}, request, set}) => {

    const filePath = path.join(process.cwd(), 'uploads', 'temp', filename); 
    console.log("Serving file from path:", filePath);
    console.log(set);
     
    const fileStats = await stat(filePath)

    if(!fileStats.isFile()) {
        set.status = 404;
        return {success: false, message: "File not found"}
    }
      const fileStream = Readable.fromWeb(
        (Bun.file(filePath).stream()) as any
      );
    
    set.headers['Content-Disposition'] = `inline; filename="${filename}"`; // Or 'attachment' for download
    set.headers['Content-Length'] = fileStats.size.toString();

    return new Response(fileStream as any);
    
  })
  .get('/music/:id/:filename', async ({ params: { id, filename }, request, set }) => {
    const decodedFilename = decodeURIComponent(filename);
    const filePath = path.join(process.cwd(), 'uploads', 'music', id, decodedFilename);
    console.log(filePath);
    const fileStats = await stat(filePath);

    if (!fileStats.isFile()) {
      set.status = 404;
      return { success: false, message: "File not found" };
    }
    const fileStream = Readable.fromWeb(
      (Bun.file(filePath).stream()) as any
    );

    set.headers['Content-Disposition'] = `inline; filename="${decodedFilename}"`; // Or 'attachment' for download
    set.headers['Content-Length'] = fileStats.size.toString();

    return new Response(fileStream as any);
  })
  .get('/avatar/*', (req: any, res: any) => {
    const requestedPath = req.url.replace('/avatar/', '');
    const filePath = path.join(__dirname, 'uploads', 'avatar', requestedPath);
  
    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        return res.status(404).send('File not found');
      }
      res.sendFile(filePath);
    });
  }).get('/albums/:id/:filename', async ({ params: { id, filename }, request, set }) => {
    const decodedFilename = decodeURIComponent(filename);
    const filePath = path.join(process.cwd(), 'uploads', 'albums', id, decodedFilename);
    console.log(filePath);
    const fileStats = await stat(filePath);

    if (!fileStats.isFile()) {
      set.status = 404;
      return { success: false, message: "File not found" };
    }
    const fileStream = Readable.fromWeb(
      (Bun.file(filePath).stream()) as any
    );

    set.headers['Content-Disposition'] = `inline; filename="${decodedFilename}"`;
    set.headers['Content-Length'] = fileStats.size.toString();

    return new Response(fileStream as any);
  })