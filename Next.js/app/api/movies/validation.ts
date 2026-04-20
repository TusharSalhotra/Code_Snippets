import zod from "zod"
export const movieSchema = zod.object({
  title: zod.string(),
  publishingYear: zod.number(),
  file: zod.object({ name: zod.string() }),
})

export const updateMovieSchema = zod.object({
  title: zod.string(),
  publishingYear: zod.number(),
  file: zod.object({ name: zod.string() }).optional(),
})
