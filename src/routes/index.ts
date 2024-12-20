import { Router } from "express";
import authRoutes from "./auth/authRoutes";
import caseRoutes from "./case/caseRoutes";
import applicationRoutes from "./application/applicationRoutes";
import violationRoutes from "./hak-ihlalleri/violationRoutes";

const router = Router();

// Modüllerin rotaları
router.use("/auth", authRoutes);
//router.use("/cases", caseRoutes);
router.use("/applications", applicationRoutes);
//router.use("/violations", violationRoutes);

export default router;
