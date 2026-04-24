import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { signAccessToken, signRefreshToken } from "../utils/token";

import { User } from "../models/User.models";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
export const updateProfile = asyncHandler(
  async (req: any, res: Response) => {
    const { username } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username: username.trim() },
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile updated",
      user,
    });
  }
);

export const updatePassword = asyncHandler(
  async (req: any, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user || !user.password) {
      throw new AppError("Google users cannot change password", 400);
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      throw new AppError("Current password incorrect", 400);
    }

    user.password = newPassword;
    await user.save();

    res.json({
      message: "Password updated",
    });
  }
);

export const register = asyncHandler(
  async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new AppError("User already exists", 400);
    }

    await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password,
    });

    const accessToken =
  signAccessToken(user._id.toString());
  
    const refreshToken =
  signRefreshToken(user._id.toString());
  
  res.cookie(
    "refreshToken",
    refreshToken,
    {
      httpOnly: true,
      secure:
      process.env.NODE_ENV ===
      "production",
      sameSite: "lax",
      maxAge:
      7 * 24 * 60 * 60 * 1000,
    }
  );
  
  res.json({
    token: accessToken,
    user,
  });
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.password) {
      throw new AppError("Invalid credentials", 400);
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      throw new AppError("Invalid credentials", 400);
    }

    const accessToken =
  signAccessToken(user._id.toString());
  
    const refreshToken =
  signRefreshToken(user._id.toString());
  
  res.cookie(
    "refreshToken",
    refreshToken,
    {
      httpOnly: true,
      secure:
      process.env.NODE_ENV ===
      "production",
      sameSite: "lax",
      maxAge:
      7 * 24 * 60 * 60 * 1000,
    }
  );
  
  res.json({
    token: accessToken,
    user,
  });
  }
);

export const logout =
  asyncHandler(
    async (_req: Request, res: Response) => {
      res.clearCookie(
        "refreshToken"
      );

      res.json({
        success: true,
      });
    }
  );

export const refreshToken =
  asyncHandler(
    async (req: Request, res: Response) => {
      const token =
        req.cookies.refreshToken;

      if (!token) {
        throw new AppError(
          "Unauthorized",
          401
        );
      }

      const decoded =
        jwt.verify(
          token,
          process.env
            .REFRESH_SECRET as string
        ) as { id: string };

      const accessToken =
        signAccessToken(
          decoded.id
        );

      res.json({
        token: accessToken,
      });
    }
  );

export const getMe = asyncHandler(
  async (req: any, res: Response) => {
    res.json(req.user);
  }
);