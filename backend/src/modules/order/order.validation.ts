import { z } from "zod";

export const createOrderValidation = z.object({
  body: z.object({
    currency: z.string().default("INR"),
    shipping_address: z.record(z.string()).optional(),
    products: z.array(
      z.record(z.string().or(z.number()).or(z.boolean()).or(z.date()))
    ),
  }),
});
