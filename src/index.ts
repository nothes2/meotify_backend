import Elysia from "elysia"
import cors from '@elysiajs/cors'
import { authController } from "@features/user/presentation/controller/auth_controller";
import {fileController} from "@features/fileload/presentation/controller/file_controller";
import { staticController } from "@features/static_access/presentation/controller/staticController";
import { connectDB } from "@core/config/database";
import { playlistController } from "@features/playlist/presentation/controller/controller_playlist";

await connectDB()
const app = new Elysia().use(cors()).use(authController).use(playlistController).use(staticController)
   .use(fileController);

app.listen(3000, () => console.info("✅ Server running at http://localhost:3000"))