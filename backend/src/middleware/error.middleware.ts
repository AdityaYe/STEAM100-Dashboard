import {
  Request,
  Response,
  NextFunction,
} from "express";

import { ZodError } from "zod";
import { AppError } from "../utils/AppError";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);
  
  if (err instanceof ZodError) {
    return res.status(400).json({
        success: false,
        essage: err.issues[0]?.message || "Validation error",
    });
}

  if (err instanceof AppError) {
    return res.status(
      err.statusCode
    ).json({
      success: false,
      message: err.message,
    });
}

  return res.status(500).json({
    success: false,
    message:
      "Internal Server Error",
  });
};