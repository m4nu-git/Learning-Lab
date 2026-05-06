import { Request, Response } from "express";
import { getDailyReport, getMonthlyReport } from "./report.service";
import { sendError, sendSuccess } from "../../utils/response";

export const daily = async (req: Request, res: Response): Promise<void> => {
  const employeeId = req.params.employeeId as string;
  const date = req.query.date as string;

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    sendError(res, "date query param required in YYYY-MM-DD format");
    return;
  }

  try {
    const report = await getDailyReport(employeeId, date);
    sendSuccess(res, report);
  } catch (err: any) {
    sendError(res, err.message, 404);
  }
};

export const monthly = async (req: Request, res: Response): Promise<void> => {
  const employeeId = req.params.employeeId as string;
  const year = Number(req.query.year);
  const month = Number(req.query.month);

  if (!year || !month || month < 1 || month > 12) {
    sendError(res, "year and month (1-12) query params are required");
    return;
  }

  try {
    const report = await getMonthlyReport(employeeId, year, month);
    sendSuccess(res, report);
  } catch (err: any) {
    sendError(res, err.message, 404);
  }
};