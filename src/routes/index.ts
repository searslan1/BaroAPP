import { Router } from "express";
import authRoutes from "./auth/authRoutes";
import caseRoutes from "./case/caseRoutes";
import applicationRoutes from "./application/applicationRoutes";
import violationRoutes from "./violation/violationRoutes";
import fileRoutes from "./case/fileRoutes";

const router = Router();

// Modüllerin rotaları
router.use("/auth", authRoutes);
router.use("/cases", caseRoutes);
router.use("/cases", fileRoutes);

router.use("/applications", applicationRoutes);
router.use("/violations", violationRoutes);

export default router;
