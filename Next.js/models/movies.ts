import mongoose from "mongoose"

const MoviesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    publishingYear: {
      type: Number,
      trim: true,
    },
    poster: {
      type: String,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

const movies = mongoose.models.Movies || mongoose.model("Movies", MoviesSchema)
export default movies
