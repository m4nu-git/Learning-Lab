import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { daily, monthly } from "./report.controller";

const router = Router();

router.use(authenticate);

// GET /reports/employees/:employeeId/daily?date=2025-05-06
router.get("/employees/:employeeId/daily", daily);

// GET /reports/employees/:employeeId/monthly?year=2025&month=5
router.get("/employees/:employeeId/monthly", monthly);

export default router;