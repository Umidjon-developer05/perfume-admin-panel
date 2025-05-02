import { connectToDatabase } from "@/lib/db"
import AdminModel from "@/lib/models/admin.model"
import { hash } from "bcryptjs"

export async function getUserByEmail(email: string) {
  try {
    await connectToDatabase()
    const user = await AdminModel.findOne({ email }).lean()
    return user
  } catch (error) {
    console.error("Failed to fetch user:", error)
    throw new Error("Failed to fetch user")
  }
}

export async function createAdmin(name: string, email: string, password: string) {
  try {
    await connectToDatabase()
    const hashedPassword = await hash(password, 10)
    const admin = new AdminModel({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    })
    await admin.save()
    return admin
  } catch (error) {
    console.error("Failed to create admin:", error)
    throw new Error("Failed to create admin")
  }
}
