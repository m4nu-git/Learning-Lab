import { Request } from "express";
import { Role } from "../generated/prisma/client";
 
export interface AuthPayload {
  userId: string;
  role: Role;
}
 
export interface AuthRequest extends Request {
  user?: AuthPayload;
}