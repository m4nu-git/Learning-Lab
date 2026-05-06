import { Request, Response } from "express";
import { z } from "zod";
import { createGuest, getGuestById, getGuests } from "./guest.service";
import { sendError, sendSuccess } from "../../utils/response";

const guestSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  purpose: z.string().optional(),
});

export const create = async (req: Request, res: Response): Promise<void> => {
  const parsed = guestSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(res, "Validation error", 422, parsed.error.issues);
    return;
  }
  try {
    const guest = await createGuest(parsed.data);
    sendSuccess(res, guest, "Guest created", 201);
  } catch (err: any) {
    sendError(res, err.message);
  }
};

export const list = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await getGuests(page, limit);
    sendSuccess(res, result);
  } catch (err: any) {
    sendError(res, err.message);
  }
};

export const getOne = async (req: Request, res: Response): Promise<void> => {
  try {
    const guest = await getGuestById(req.params.id as string);
    sendSuccess(res, guest);
  } catch (err: any) {
    sendError(res, err.message, 404);
  }
};