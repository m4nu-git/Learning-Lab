import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import {
  employeeHistory,
  employeePunchIn,
  employeePunchOut,
  guestHistory,
  guestPunchIn,
  guestPunchOut,
} from "./attendance.controller";

const router = Router();

router.use(authenticate);

// Employee punch
router.post("/employees/:employeeId/punch-in", employeePunchIn);
router.post("/employees/:employeeId/punch-out", employeePunchOut);
router.get("/employees/:employeeId/history", employeeHistory);

// Guest punch
router.post("/guests/:guestId/punch-in", guestPunchIn);
router.post("/guests/:guestId/punch-out", guestPunchOut);
router.get("/guests/:guestId/history", guestHistory);

export default router;