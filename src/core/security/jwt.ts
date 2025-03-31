import jwt from "@elysiajs/jwt";

export const jwtService = jwt({
    name:"jwt",
    secret: process.env.JWT_SECRET ?? "glowspia",
    exp: "30m"
})