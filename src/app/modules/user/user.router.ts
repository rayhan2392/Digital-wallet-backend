import { Router } from "express";
import { userControllers } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();
router.post("/register",userControllers.createUser)
router.post("/create-admin",checkAuth(Role.SUPER_ADMIN), userControllers.createAdmin)     //superadmin only route
router.get("/all-users",userControllers.getAllUsers)
router.get("/:id",userControllers.getSingleUser)
// router.get("/me")   //will implement later
//block/unblock user
router.patch("/block/:id",userControllers.handleBlockUser)
router.patch("/unblock/:id",userControllers.handleUnblockUser)
//approve/suspend agent
router.patch("/approve/:id",userControllers.handleApproveAgent)
router.patch("/suspend/:id",userControllers.handleSuspendAgent)


export const UserRoutes =router