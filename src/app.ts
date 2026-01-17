import express, { Request, Response } from "express";
import router from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandlers";
import cookieParser from "cookie-parser";
import notFound from "./app/middlewares/notFound";
import { envVars } from "./app/config/env";
import cors from 'cors'

const app = express()
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [envVars.FRONTEND_URL, "https://digital-wallet-frontend-nine.vercel.app"],
    credentials: true
}))


app.use("/api/v1",router)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to digital wallet backend"
    })
})

app.use(notFound)

app.use(globalErrorHandler)

export default app