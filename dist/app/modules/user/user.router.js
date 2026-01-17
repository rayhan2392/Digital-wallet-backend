"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("./user.interface");
const validateRequest_1 = require("../../middlewares/validateRequest");
const user_validate_1 = require("./user.validate");
const router = (0, express_1.Router)();
router.post("/register", (0, validateRequest_1.validateRequest)(user_validate_1.registerUserZodSchema), user_controller_1.userControllers.createUser);
router.post("/create-admin", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SUPER_ADMIN), user_controller_1.userControllers.createAdmin); //superadmin only route
router.get("/me", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), user_controller_1.userControllers.getMyProfile);
router.get("/all-users", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.userControllers.getAllUsers);
router.get("/agents", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), user_controller_1.userControllers.getAllAgents);
router.get("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.userControllers.getSingleUser);
//block/unblock user
router.patch("/block/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.userControllers.handleBlockUser);
router.patch("/unblock/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.userControllers.handleUnblockUser);
//approve/suspend agent
router.patch("/approve/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.userControllers.handleApproveAgent);
router.patch("/suspend/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.userControllers.handleSuspendAgent);
exports.UserRoutes = router;
