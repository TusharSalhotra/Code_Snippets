import mongoose from "mongoose"
import bcrypt from "bcrypt"

const UsersSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [false, "First name is required!"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [false, "Last name is required!"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required!"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required!"],
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
UsersSchema.pre("save", async function (next) {
  try {
    const savedPassword = await bcrypt.hash(this.password as unknown as any, 5)
    this.password = savedPassword
    next()
  } catch (error) {
    return error
  }
})

const Users = mongoose.models.User || mongoose.model("User", UsersSchema)
export default Users
