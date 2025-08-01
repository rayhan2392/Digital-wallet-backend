import { Router } from "express";
import { transactionControllers } from "./transaction.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.get("/", checkAuth(Role.SUPER_ADMIN, Role.ADMIN), transactionControllers.getAllTransactions)
router.get("/me", checkAuth(Role.USER, Role.AGENT), transactionControllers.getMyTransactions)

export const TransactionRoutes = router