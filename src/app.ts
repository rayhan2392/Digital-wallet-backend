import express, { Request, Response } from "express";
import router from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandlers";

const app = express()
app.use(express.json());


app.use("/",router)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to digital wallet backend"
    })
})

app.use(globalErrorHandler)

export default app