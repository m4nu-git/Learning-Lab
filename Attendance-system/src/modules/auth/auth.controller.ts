import { Request, Response } from "express";
import { z } from "zod";
import { loginUser, registerUser } from "./auth.service";
import { sendError, sendSuccess } from "../../utils/response";
import { Role } from "../../generated/prisma/client";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "OPERATOR"]).optional().default(Role.OPERATOR),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const register = async (req: Request, res: Response): Promise<void> => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(res, "Validation error", 422, parsed.error.issues);
    return;
  }
  try {
    const { name, email, password, role } = parsed.data;
    const user = await registerUser(name, email, password, role as Role);
    sendSuccess(res, user, "User registered successfully", 201);
  } catch (err: any) {
    sendError(res, err.message);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(res, "Validation error", 422, parsed.error.issues);
    return;
  }
  try {
    const { email, password } = parsed.data;
    const result = await loginUser(email, password);
    sendSuccess(res, result, "Login successful");
  } catch (err: any) {
    sendError(res, err.message, 401);
  }
};