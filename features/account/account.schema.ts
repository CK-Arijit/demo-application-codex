import { z } from "zod";

export const accountEmailSchema = z.string().trim().email().max(254);

export const dashboardAccountDetailsSchema = z.object({
  firstName: z.string().trim().max(80),
  lastName: z.string().trim().max(80),
  email: accountEmailSchema,
  phone: z.string().trim().max(40),
  address: z.string().trim().max(255),
});
