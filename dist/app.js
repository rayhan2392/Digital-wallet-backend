"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorHandlers_1 = require("./app/middlewares/globalErrorHandlers");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const env_1 = require("./app/config/env");
const cors_1 = __importDefault(require("cors"));
const ensureDbConnection_1 = require("./app/middlewares/ensureDbConnection");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: [env_1.envVars.FRONTEND_URL, "https://digital-wallet-frontend-nine.vercel.app"],
    credentials: true
}));
// Ensure DB connection for serverless (Vercel)
if (process.env.VERCEL) {
    app.use(ensureDbConnection_1.ensureDbConnection);
}
app.use("/api/v1", routes_1.default);
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to digital wallet backend"
    });
});
app.use(notFound_1.default);
app.use(globalErrorHandlers_1.globalErrorHandler);
exports.default = app;
