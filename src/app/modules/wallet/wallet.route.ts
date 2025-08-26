import { checkAuth } from './../../middlewares/checkAuth';
import { Router } from "express";
import { walletControllers } from "./wallet.controller";
import { Role } from '../user/user.interface';

const router = Router();
router.get("/", checkAuth(Role.SUPER_ADMIN, Role.ADMIN), walletControllers.getAllWallets)
router.get("/me", checkAuth(Role.USER, Role.AGENT), walletControllers.getMyWallet)
router.post("/send", checkAuth(Role.USER), walletControllers.sendMoney)
router.post("/cash-in", checkAuth(Role.AGENT), walletControllers.cashInMoney)
router.post("/cash-out", checkAuth(Role.USER), walletControllers.cashOutMoney)
router.get("/:id", checkAuth(Role.SUPER_ADMIN, Role.ADMIN), walletControllers.getWalletById)
router.patch("/block/:id", checkAuth(Role.SUPER_ADMIN, Role.ADMIN), walletControllers.blockWallet)
router.patch("/unblock/:id", checkAuth(Role.SUPER_ADMIN, Role.ADMIN), walletControllers.unBlockWallet)

export const WalletRoutes = router;