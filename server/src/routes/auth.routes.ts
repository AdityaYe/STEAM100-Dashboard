import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

import {
  login,
  logout,
  register,
  getMe,
  updateProfile,
  updatePassword,
  refreshToken
} from "../controllers/auth.controller";

import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  updatePasswordSchema,
} from "../validators/auth.schema";

import { validate } from "../middleware/validate.middleware";
import { authLimiter, actionLimiter } from "../middleware/rateLimit.middleware";

import { protect } from "../middleware/auth.middleware";

const router = Router();

const JWT_SECRET =
  process.env.JWT_SECRET as string;

const PROD_URL =
  process.env.CLIENT_URL;

const LOCAL_URL =
  "http://localhost:5173";

router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  register
);

router.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  login
);

router.post(
  "/refresh",
  authLimiter,
  refreshToken
);

router.patch(
  "/profile",
  actionLimiter,
  protect,
  validate(updateProfileSchema),
  updateProfile
);

router.patch(
  "/password",
  actionLimiter,
  protect,
  validate(updatePasswordSchema),
  updatePassword
);

router.get(
  "/google",
  passport.authenticate(
    "google",
    {
      scope: [
        "profile",
        "email",
      ],
    }
  )
);

router.get(
  "/me",
  protect,
  getMe
);

router.get(
  "/google/callback",
  passport.authenticate(
    "google",
    { session: false }
  ),
  (req, res) => {
    const user = req.user as any;

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const referer =
      req.get("referer") || "";

    const isLocal =
      referer.includes("localhost");

    const redirectUrl =
      isLocal
        ? LOCAL_URL
        : PROD_URL || LOCAL_URL;

    res.redirect(
      `${redirectUrl}/?token=${token}`
    );
  }
);

export default router;