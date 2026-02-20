import type { Request } from "express";

/* export const cookieExtractor = (req: Request) => {
  const token = req.cookies.token;
  if (!token) {
    return null;
  }
  return token.split("=")[1];
}; */

export const cookieExtractor = (req: Request) => {
  console.log("Cookies:", req.cookies); // Agrega este log para verificar las cookies
  console.log("Token:", req.cookies?.token); // Agrega este log para verificar las cookies
  return req.cookies?.token ?? null;
};
 