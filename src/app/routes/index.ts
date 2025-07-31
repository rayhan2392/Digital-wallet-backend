import { Router } from "express";
import { UserRoutes } from "../modules/user/user.router";
import { AuthRoutes } from "../modules/auth/auth.route";
import { WalletRoutes } from "../modules/wallet/wallet.route";

const router= Router();

const moduleRoutes = [
    {
        path:'/user',
        route:UserRoutes,
    },
    {
        path:'/auth',
        route:AuthRoutes
    },
    {
        path:'/wallet',
        route:WalletRoutes
    }
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})

export default router;