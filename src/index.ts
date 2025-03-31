import Elysia from "elysia"
import cors from '@elysiajs/cors'
import { authController } from "@features/user/presentation/controller/auth_controller";
import { jwtService } from "@core/security/jwt";

const app = new Elysia()

app.use(cors()).use(authController);

app.listen(3000, () => console.info("✅ Server running at http://localhost:3000"))