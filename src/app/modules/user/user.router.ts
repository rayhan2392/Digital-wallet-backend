import { Router } from "express";
import { userControllers } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { registerUserZodSchema } from "./user.validate";

const router = Router();
router.post("/register",validateRequest(registerUserZodSchema), userControllers.createUser)
router.post("/create-admin",checkAuth(Role.SUPER_ADMIN), userControllers.createAdmin)     //superadmin only route
router.get("/me",checkAuth(...Object.values(Role)),userControllers.getMyProfile)
router.get("/all-users",checkAuth(Role.ADMIN,Role.SUPER_ADMIN), userControllers.getAllUsers)
router.get("/agents",checkAuth(...Object.values(Role)), userControllers.getAllAgents)
router.get("/:id",checkAuth(Role.ADMIN,Role.SUPER_ADMIN), userControllers.getSingleUser)

//block/unblock user
router.patch("/block/:id",checkAuth(Role.ADMIN,Role.SUPER_ADMIN), userControllers.handleBlockUser)
router.patch("/unblock/:id",checkAuth(Role.ADMIN,Role.SUPER_ADMIN), userControllers.handleUnblockUser)
//approve/suspend agent
router.patch("/approve/:id",checkAuth(Role.ADMIN,Role.SUPER_ADMIN), userControllers.handleApproveAgent)
router.patch("/suspend/:id",checkAuth(Role.ADMIN,Role.SUPER_ADMIN), userControllers.handleSuspendAgent)


export const UserRoutes =router