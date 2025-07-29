import express, { Request, Response } from "express";
import router from "./app/routes";

const app = express()
app.use(express.json());


app.use("/",router)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to digital wallet backend"
    })
})

export default app