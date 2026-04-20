import zod from "zod"
export const schema = zod.object({
  email: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
})
