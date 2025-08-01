import { Router } from "express";
import { userControllers } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();
router.post("/register",userControllers.createUser)
router.post("/create-admin",checkAuth(Role.SUPER_ADMIN), userControllers.createAdmin)     //superadmin only route
router.get("/me",checkAuth(...Object.values(Role)),userControllers.getMyProfile)
router.get("/all-users",checkAuth(Role.ADMIN,Role.SUPER_ADMIN), userControllers.getAllUsers)
router.get("/:id",checkAuth(Role.ADMIN,Role.SUPER_ADMIN), userControllers.getSingleUser)
// router.get("/me")   //will implement later
//block/unblock user
router.patch("/block/:id",checkAuth(Role.ADMIN,Role.SUPER_ADMIN), userControllers.handleBlockUser)
router.patch("/unblock/:id",checkAuth(Role.ADMIN,Role.SUPER_ADMIN), userControllers.handleUnblockUser)
//approve/suspend agent
router.patch("/approve/:id",checkAuth(Role.ADMIN,Role.SUPER_ADMIN), userControllers.handleApproveAgent)
router.patch("/suspend/:id",checkAuth(Role.ADMIN,Role.SUPER_ADMIN), userControllers.handleSuspendAgent)


export const UserRoutes =router