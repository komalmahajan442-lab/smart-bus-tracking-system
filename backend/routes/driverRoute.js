import Router from "express";
import { auth, authorizeRoles } from "../middlewares/AuthMiddleware.js";
import { getDriverDashboard, updateLocation,startTrip,endTrip, pickupStatus } from "../controllers/driverController.js";

const router=Router();

router.get("/dashboard",auth,authorizeRoles("driver"),getDriverDashboard);
router.put("/updatelocation",auth,authorizeRoles("driver"),updateLocation);
router.put("/start-trip",auth,authorizeRoles("driver"),startTrip);
router.put("/end-trip",auth,authorizeRoles("driver"),endTrip);
router.put("/pickup/:studentId",auth,authorizeRoles("driver"),pickupStatus);

export default router;