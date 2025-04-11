import path from 'path';
import { Elysia} from 'elysia';
import { stat } from 'node:fs/promises';
import { Readable } from "stream";


export const staticController = new Elysia().get('/temp/:filename', async ({params: {filename}, request, set}) => {
  const decodedFilename = decodeURIComponent(filename)
    const filePath = path.join(process.cwd(), 'uploads', 'temp', decodedFilename); 
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
    
    set.headers['Content-Disposition'] = `inline; filename="${decodedFilename}"`; // Or 'attachment' for download
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

    set.headers['Content-Disposition'] = `inline; filename="${decodedFilename}"`; 
    set.headers['Content-Length'] = fileStats.size.toString();

    return new Response(fileStream as any);
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