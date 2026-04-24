import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET as string;

const REFRESH_SECRET =
  process.env.REFRESH_SECRET as string;

export const signAccessToken =
  (id: string) =>
    jwt.sign(
      { id },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

export const signRefreshToken =
  (id: string) =>
    jwt.sign(
      { id },
      REFRESH_SECRET,
      { expiresIn: "7d" }
    );