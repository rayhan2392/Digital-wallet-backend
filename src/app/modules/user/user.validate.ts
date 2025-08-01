import { z } from "zod";

// Bangladeshi phone number regex
const bdPhoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;

export const registerUserZodSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(bdPhoneRegex, "Invalid Bangladeshi phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "agent"]).optional(),
});
