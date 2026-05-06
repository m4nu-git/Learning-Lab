import { Request, Response } from "express";
import { z } from "zod";
import {
  createEmployee,
  getEmployeeById,
  getEmployees,
  toggleEmployeeStatus,
} from "./employee.service";
import { sendError, sendSuccess } from "../../utils/response";

const createEmployeeSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export const create = async (req: Request, res: Response): Promise<void> => {
  const parsed = createEmployeeSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(res, "Validation error", 422, parsed.error.issues);
    return;
  }
  try {
    const employee = await createEmployee(parsed.data);
    sendSuccess(res, employee, "Employee created", 201);
  } catch (err: any) {
    sendError(res, err.message);
  }
};

export const list = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search as string | undefined;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await getEmployees(search, page, limit);
    sendSuccess(res, result);
  } catch (err: any) {
    sendError(res, err.message);
  }
};

export const getOne = async (req: Request, res: Response): Promise<void> => {
  try {
    const employee = await getEmployeeById(req.params.id as string);
    sendSuccess(res, employee);
  } catch (err: any) {
    sendError(res, err.message, 404);
  }
};

export const toggleStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { isActive } = req.body;
  if (typeof isActive !== "boolean") {
    sendError(res, "isActive (boolean) is required");
    return;
  }
  try {
    const employee = await toggleEmployeeStatus(req.params.id as string, isActive);
    sendSuccess(res, employee, `Employee ${isActive ? "enabled" : "disabled"}`);
  } catch (err: any) {
    sendError(res, err.message, 404);
  }
};