import jwt from "jsonwebtoken";
import {
  Request,
  Response,
  NextFunction,
} from "express";

import { User } from "../models/User.models";

interface AuthRequest
  extends Request {
  user?: any;
}

/* REQUIRED AUTH */
export const protect =
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authHeader =
        req.headers
          .authorization;

      if (
        !authHeader?.startsWith(
          "Bearer "
        )
      ) {
        return res
          .status(401)
          .json({
            message:
              "Not authorized",
          });
      }

      const token =
        authHeader.split(
          " "
        )[1];

      if (!token) {
        return res
          .status(401)
          .json({
            message:
              "Token missing",
          });
      }

      const decoded =
        jwt.verify(
          token,
          process.env
            .JWT_SECRET as string
        ) as {
          id: string;
        };

      const user =
        await User.findById(
          decoded.id
        ).select(
          "-password"
        );

      if (!user) {
        return res
          .status(401)
          .json({
            message:
              "User not found",
          });
      }

      req.user = user;

      next();
    } catch {
      return res
        .status(401)
        .json({
          message:
            "Invalid or expired token",
        });
    }
  };

/* OPTIONAL AUTH */
export const optionalAuth =
  async (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
  ) => {
    try {
      const authHeader =
        req.headers
          .authorization;

      if (
        !authHeader?.startsWith(
          "Bearer "
        )
      ) {
        return next();
      }

      const token =
        authHeader.split(
          " "
        )[1];

      if (!token) {
        return next();
      }

      const decoded =
        jwt.verify(
          token,
          process.env
            .JWT_SECRET as string
        ) as {
          id: string;
        };

      const user =
        await User.findById(
          decoded.id
        ).select(
          "-password"
        );

      if (user) {
        req.user = user;
      }

      next();
    } catch {
      next();
    }
  };