import { z } from "zod"

export const usernameSchema = z.object({
  name: z.string().min(1),
})
