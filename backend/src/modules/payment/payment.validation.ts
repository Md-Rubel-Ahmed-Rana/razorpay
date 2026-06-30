import { z } from "zod";

export const createOrderValidation = z.object({
  body: z.object({
    amount: z.number().positive("Amount must be greater than 0"),

    currency: z.string().default("INR"),

    receipt: z.string().min(1),

    notes: z.record(z.string()).optional(),
  }),
});
