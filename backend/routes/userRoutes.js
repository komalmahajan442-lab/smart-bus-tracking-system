import Routes from "express";
import { register,login } from "../controllers/userController.js";
import { createBus, createRoute, createStop, getBus, getRoutes } from "../controllers/adminController.js";
import { auth} from "../middlewares/AuthMiddleware.js";

const router=Routes();

router.post("/register",register);
router.post("/login",login);


export default router;