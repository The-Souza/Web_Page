import { z } from "zod";

/**
 * Schema zod para o payload do JWT.
 * Usamos esse schema como fonte de verdade para tipagem + validação.
 */
export const JwtPayloadSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string().optional(),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;
