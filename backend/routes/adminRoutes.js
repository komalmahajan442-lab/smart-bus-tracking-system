import Routes from "express";

import { createBus, createRoute, createStop, deleteBus, deleteRoute, deleteStop, getAdminDashboard, getBus, getRoutes, updateRoute,assignedBusToDriver,assignedBusToStudent, getdriver, getStudent, getAssignments, updateUser ,toggleBusStatus, getStudentAssignments, deleteUser} from "../controllers/adminController.js";
import { auth, authorizeRoles} from "../middlewares/AuthMiddleware.js";
import { approveUser, getUsers, pendingUser, rejectUser } from "../controllers/userController.js";

const router=Routes();

router.post("/createroute",auth,authorizeRoles("admin"),createRoute);
router.get("/getroute",auth,authorizeRoles("admin"),getRoutes);
router.put("/route/:id",auth,authorizeRoles("admin"),updateRoute);
router.delete("/route/:id",auth,authorizeRoles("admin"),deleteRoute);


router.post("/createbus",auth,authorizeRoles("admin"),createBus);
router.get("/getbus",auth,authorizeRoles("admin"),getBus);
//router.put("/bus/:id",auth,authorizeRoles("admin"),updateBus);
router.delete("/deletebus/:id",auth,authorizeRoles("admin"),deleteBus);

router.post("/createstop",auth,authorizeRoles("admin"),createStop);
router.delete("/stop/:id",auth,authorizeRoles("admin"),deleteStop);

router.get("/admin",auth,authorizeRoles("admin"),getAdminDashboard);


router.put("/assign-bus-driver/:driverId", auth, authorizeRoles("admin"), assignedBusToDriver);

router.put("/assign-bus-student/:studentId", auth, authorizeRoles("admin"), assignedBusToStudent);
router.get("/getdriver",auth,authorizeRoles("admin"),getdriver);
router.get("/getstudent",auth,authorizeRoles("admin"),getStudent);
router.get("/getpendinguser",auth,authorizeRoles("admin"),pendingUser);
router.put("/approveuser/:id",auth,authorizeRoles('admin'),approveUser);
router.put("/rejectuser/:id",auth,authorizeRoles('admin'),rejectUser);
router.get('/getusers',auth,authorizeRoles('admin'),getUsers);
router.get('/assignments',auth,authorizeRoles('admin'),getAssignments);

router.put('/updateuser/:id',auth,authorizeRoles('admin'),updateUser);
router.put("/bus/toggle/:id", auth, authorizeRoles("admin"), toggleBusStatus);
router.get('/student-assignments',auth,authorizeRoles("admin"),getStudentAssignments);
router.delete('/deleteuser/:id',auth,authorizeRoles('admin'),deleteUser);

export default router;