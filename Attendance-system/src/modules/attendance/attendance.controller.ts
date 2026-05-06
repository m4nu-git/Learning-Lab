import { Request, Response } from "express";
import { PersonType } from "../../generated/prisma/client";
import {
  getPunchHistory,
  punchInEmployee,
  punchInGuest,
  punchOutEmployee,
  punchOutGuest,
} from "./attendance.service";
import { sendError, sendSuccess } from "../../utils/response";

export const employeePunchIn = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const event = await punchInEmployee(req.params.employeeId as string);
    sendSuccess(res, event, "Punch in recorded", 201);
  } catch (err: any) {
    sendError(res, err.message);
  }
};

export const employeePunchOut = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const event = await punchOutEmployee(req.params.employeeId as string);
    sendSuccess(res, event, "Punch out recorded");
  } catch (err: any) {
    sendError(res, err.message);
  }
};

export const guestPunchIn = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const event = await punchInGuest(req.params.guestId as string);
    sendSuccess(res, event, "Guest punch in recorded", 201);
  } catch (err: any) {
    sendError(res, err.message);
  }
};

export const guestPunchOut = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const event = await punchOutGuest(req.params.guestId as string);
    sendSuccess(res, event, "Guest punch out recorded");
  } catch (err: any) {
    sendError(res, err.message);
  }
};

export const employeeHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const result = await getPunchHistory(
      PersonType.EMPLOYEE,
      req.params.employeeId as string,
      page,
      limit
    );
    sendSuccess(res, result);
  } catch (err: any) {
    sendError(res, err.message);
  }
};

export const guestHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const result = await getPunchHistory(
      PersonType.GUEST,
      req.params.guestId as string,
      page,
      limit
    );
    sendSuccess(res, result);
  } catch (err: any) {
    sendError(res, err.message);
  }
};