import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30),

  email: z
    .string()
    .trim()
    .email("Invalid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email"),

  password: z.string().min(1, "Password required"),
});

export const updateProfileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30),
});

export const updatePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Current password required"),

  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters"),
});