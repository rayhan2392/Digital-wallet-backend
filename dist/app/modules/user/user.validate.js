"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserZodSchema = void 0;
const zod_1 = require("zod");
// Bangladeshi phone number regex
const bdPhoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
exports.registerUserZodSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.email("Invalid email address"),
    phone: zod_1.z.string().regex(bdPhoneRegex, "Invalid Bangladeshi phone number"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    role: zod_1.z.enum(["user", "agent"]).optional(),
});
