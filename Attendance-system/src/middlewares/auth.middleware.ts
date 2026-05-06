import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AuthPayload, AuthRequest } from "../types";
import { sendError } from "../utils/response";
import { Role } from "../generated/prisma/client";

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    sendError(res, "Unauthorized", 401);
    return;
  }

  const token = authHeader.split(" ")[1]!;
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as unknown as AuthPayload;
    req.user = payload;
    next();
  } catch {
    sendError(res, "Invalid or expired token", 401);
  }
};

export const requireRole = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      sendError(res, "Forbidden: insufficient permissions", 403);
      return;
    }
    next();
  };
};