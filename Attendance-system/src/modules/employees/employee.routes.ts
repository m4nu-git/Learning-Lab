import { Router } from "express";
import { authenticate, requireRole } from "../../middlewares/auth.middleware";
import { create, getOne, list, toggleStatus } from "./employee.controller";
import { Role } from "../../generated/prisma/client";

const router = Router();

router.use(authenticate);

router.get("/", list);
router.get("/:id", getOne);
router.post("/", requireRole(Role.ADMIN), create);
router.patch("/:id/status", requireRole(Role.ADMIN), toggleStatus);

export default router;