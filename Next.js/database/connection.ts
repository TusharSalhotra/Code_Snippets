import mongoose from "mongoose"

const connection: any = {}

;(async function dbConnect() {
  if (connection.isConnected) {
    return
  }

  try {
    const db = await mongoose.connect(
      process.env.MONGO_URL as unknown as string
    )

    connection.isConnected = db.connections[0].readyState
  } catch (error) {
    const e = error as unknown as Error
    console.log(e.message)
  }
})()
