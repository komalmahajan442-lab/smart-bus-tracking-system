import Router from "express";
import {auth, authorizeRoles } from "../middlewares/AuthMiddleware.js";
import { getStudentDashboard, getstudentprofile, UpdateStudent } from "../controllers/studentController.js";

const router=Router();

router.get("/me",auth,authorizeRoles("student"),getstudentprofile);
router.get("/dashboard",auth,authorizeRoles("student"),getStudentDashboard);

export default router;
